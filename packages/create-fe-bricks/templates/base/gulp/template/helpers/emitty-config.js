import { createRequire } from 'module';
import userConfig from '../../../user.config.js';
const {
    templateEngine,
    sourceFolder
} = userConfig;

const emittyConfig = (() => {
    if (templateEngine === 'nunjucks') {
        return {
            extensions: ['.njk', '.html'],
            matcher: /{%\s*(?:include|import|extends|from)\s['"]([^'"]+)['"]\s.*?%}/,
            comments: {
                start: '{#',
                end: '#}'
            }
        };
    }

    if (templateEngine === 'twig') {
        return {
            extensions: ['.twig', '.html.twig', '.html'],
            matcher: /{%\s*(?:include|import|extends|from)\s+['"]([^'"]+)['"][^%]*%}/,
            comments: { start: '{#', end: '#}' }
        };
    }

    return templateEngine;
})();

const emitty = createRequire(import.meta.url)('emitty').setup(sourceFolder, emittyConfig);

export default emitty;
