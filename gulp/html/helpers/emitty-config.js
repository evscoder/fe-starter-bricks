import { createRequire } from 'module';
import * as config from '../../config.js';

const {
    templatePreproc
} = config.argvMode;

const emittyConfig = (() => {
    if (templatePreproc === 'nunjucks') {
        return {
            extensions: ['.njk', '.html'],
            matcher: /{%\s*(?:include|import|extends|from)\s['"]([^'"]+)['"]\s.*?%}/,
            comments: {
                start: '{#',
                end: '#}'
            }
        };
    }

    if (templatePreproc === 'twig') {
        return {
            extensions: ['.twig', '.html.twig', '.html'],
            matcher: /{%\s*(?:include|import|extends|from)\s+['"]([^'"]+)['"][^%]*%}/,
            comments: { start: '{#', end: '#}' }
        };
    }

    return templatePreproc;
})();

const emitty = createRequire(import.meta.url)('emitty').setup(config.sourceFolder, emittyConfig);

export default emitty;
