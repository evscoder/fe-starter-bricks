import path from 'node:path';
import { readdir, readFile } from 'node:fs/promises';
import { Transform } from 'node:stream';

const ENGINE_EXTENSIONS = {
    pug: ['.pug'],
    twig: ['.twig', '.html'],
    nunjucks: ['.njk', '.html']
};

const stripPugComments = content => {
    const lines = [];
    let commentIndent = null;

    for (const line of content.split(/\r?\n/)) {
        const indent = line.match(/^\s*/)[0].length;

        if (commentIndent !== null) {
            if (!line.trim() || indent > commentIndent) {
                continue;
            }

            commentIndent = null;
        }

        if (line.trimStart().startsWith('//')) {
            commentIndent = indent;
            continue;
        }

        lines.push(line);
    }

    return lines.join('\n');
};

const parseReferences = (content, engine) => {
    const references = [];
    let dynamic = false;

    if (engine === 'pug') {
        const source = stripPugComments(content);
        const tags = source.matchAll(/(?:^|:)[ \t]*(?:include|extends)(?::[\w-]+)?[ \t]+(.+)$/gm);

        for (const tag of tags) {
            const target = tag[1].trim();

            if (target.includes('#{') || target.startsWith('@')) {
                dynamic = true;
            } else {
                references.push(target.replace(/^(['"])(.*)\1$/, '$2'));
            }
        }

        return { references, dynamic };
    }

    const source = content
        .replace(/{#[\s\S]*?#}/g, '')
        .replace(/{%-?\s*(?:raw|verbatim)\s*-?%}[\s\S]*?{%-?\s*end(?:raw|verbatim)\s*-?%}/g, '');
    const tags = source.matchAll(/{%-?\s*(include|extends|import|from|embed|use)\s+([\s\S]*?)-?%}/g);

    for (const tag of tags) {
        const expression = tag[2].trim();
        const literal = expression.match(/^(['"])([^'"]+)\1([\s\S]*)$/);

        // Expressions, fallback lists and concatenated paths cannot be resolved safely.
        if (!literal || !/^(?:\s+(?:with|without|only|ignore|as|import)\b[\s\S]*)?$/.test(literal[3])) {
            dynamic = true;
            continue;
        }

        if (literal[2].startsWith('@') || literal[2].includes('\\')) {
            dynamic = true;
            continue;
        }

        references.push(literal[2]);
    }

    // Twig also supports functional includes and parent templates in expressions.
    if (/\b(?:include|source|extends)\s*\(/.test(source)) {
        dynamic = true;
    }

    return { references, dynamic };
};

export class TemplateDependencies {
    constructor({ root, engine }) {
        if (!ENGINE_EXTENSIONS[engine]) {
            throw new Error(`Unsupported template engine: ${engine}`);
        }

        this.root = path.resolve(root);
        this.engine = engine;
        this.extensions = ENGINE_EXTENSIONS[engine];
        this.files = new Map();
        this.parents = new Map();
        this.dynamicFiles = new Set();
        this.initialized = false;
    }

    resolveReferences(file, reference) {
        const normalized = reference.replace(/\\/g, '/');
        const candidates = new Set();
        const locations = normalized.startsWith('/')
            ? [path.resolve(this.root, `.${normalized}`)]
            : [
                path.resolve(path.dirname(file), normalized),
                path.resolve(this.root, normalized)
            ];

        for (const location of locations) {
            candidates.add(location);

            if (this.engine === 'pug' && !path.extname(location)) {
                candidates.add(`${location}.pug`);
            }
        }

        return candidates;
    }

    async update(file) {
        let content = null;

        try {
            content = await readFile(file, 'utf8');
        } catch (error) {
            if (error.code !== 'ENOENT') {
                throw error;
            }
        }

        const previous = this.files.get(file);
        this.dynamicFiles.delete(file);

        if (previous) {
            for (const dependency of previous.dependencies) {
                const parents = this.parents.get(dependency);
                parents?.delete(file);

                if (parents?.size === 0) {
                    this.parents.delete(dependency);
                }
            }
        }

        if (content === null) {
            // Keep incoming edges: parents still reference a deleted partial.
            this.files.delete(file);
            return;
        }

        const { references, dynamic } = parseReferences(content, this.engine);
        const dependencies = new Set();

        for (const reference of references) {
            for (const dependency of this.resolveReferences(file, reference)) {
                dependencies.add(dependency);

                if (!this.parents.has(dependency)) {
                    this.parents.set(dependency, new Set());
                }

                this.parents.get(dependency).add(file);
            }
        }

        this.files.set(file, { dependencies });

        if (dynamic) {
            this.dynamicFiles.add(file);
        }
    }

    async scanDirectory(directory) {
        const entries = await readdir(directory, { withFileTypes: true });

        for (const entry of entries) {
            const file = path.join(directory, entry.name);

            if (entry.isDirectory()) {
                await this.scanDirectory(file);
            } else if (entry.isFile() && this.extensions.includes(path.extname(file))) {
                await this.update(file);
            }
        }
    }

    async scan(changedFiles = []) {
        if (!this.initialized) {
            this.files.clear();
            this.parents.clear();
            this.dynamicFiles.clear();
            await this.scanDirectory(this.root);
            this.initialized = true;
            return null;
        }

        const changes = Array.isArray(changedFiles) ? changedFiles : [changedFiles];
        const changed = changes.filter(Boolean).map(file => path.resolve(file));

        if (changed.length === 0) {
            return null;
        }

        const hadDynamicReferences = this.dynamicFiles.size > 0;

        for (const file of changed) {
            await this.update(file);
        }

        if (hadDynamicReferences || this.dynamicFiles.size > 0) {
            return null;
        }

        const affected = new Set(changed);
        const queue = [...changed];

        for (let index = 0; index < queue.length; index += 1) {
            for (const parent of this.parents.get(queue[index]) || []) {
                if (!affected.has(parent)) {
                    affected.add(parent);
                    queue.push(parent);
                }
            }
        }

        return affected;
    }

    filter(affected = null) {
        return new Transform({
            objectMode: true,
            transform(file, encoding, callback) {
                if (affected === null || affected.has(path.resolve(file.path))) {
                    callback(null, file);
                } else {
                    callback();
                }
            }
        });
    }
}
