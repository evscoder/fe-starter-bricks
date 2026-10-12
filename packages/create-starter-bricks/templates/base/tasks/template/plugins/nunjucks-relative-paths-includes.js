import path from 'path';
import through2 from 'through2';

export default function nunjucksResolveRelativeIncludes({ root }) {
    const TAG_RE = /{%\s*(include|extends|import|from)\s+(['"])([^'"]+)\2/g;

    const toPosix = (p) => p.replace(/\\/g, '/');

    return through2.obj(function (file, enc, cb) {
        if (file.isNull()) return cb(null, file);
        if (file.isStream()) return cb(new Error('Streaming not supported'));

        const rootAbs = path.resolve(root);
        const fileDirAbs = path.dirname(file.path);

        const fromDirRel = toPosix(path.relative(rootAbs, fileDirAbs));

        let html = file.contents.toString(enc);

        html = html.replace(TAG_RE, (full, tag, quote, target) => {
            if (!target.startsWith('./') && !target.startsWith('../')) return full;

            const resolved = path.posix.normalize(
                path.posix.join(fromDirRel ? fromDirRel : '', toPosix(target))
            );

            if (resolved.startsWith('..')) {
                throw new Error(
                    `Nunjucks path escapes root.\nFile: ${file.path}\nTag: ${tag} "${target}"`
                );
            }

            return `{% ${tag} ${quote}${resolved}${quote}`;
        });

        file.contents = Buffer.from(html, enc);
        cb(null, file);
    });
}
