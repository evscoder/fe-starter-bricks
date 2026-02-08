import nunjucks from 'nunjucks';
import path from 'path';

export default class RelativeFileSystemLoader extends nunjucks.FileSystemLoader {
    constructor(searchPaths, opts = {}) {
        super(searchPaths, { noCache: true, ...opts });
        this._roots = (Array.isArray(searchPaths) ? searchPaths : [searchPaths])
            .map(p => path.resolve(p));
    }

    resolve(from, to) {
        if (!to.startsWith('./') && !to.startsWith('../')) return to;

        const fromDir = from ? path.posix.dirname(from.replace(/\\/g, '/')) : '';
        const resolved = path.posix.normalize(path.posix.join(fromDir, to));

        if (resolved.startsWith('../')) {
            throw new Error(`Nunjucks path escapes root: from="${from}" to="${to}"`);
        }

        return resolved;
    }

    getSource(name) {
        return super.getSource(String(name).replace(/\\/g, '/'));
    }
}
