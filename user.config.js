/**
 * Global build environment configuration
 * @typedef {Object} BuildEnv
 *
 * @property {string|null} PROJECT_VERSION
 * Project version.
 * If `null` — default version ("1.0").
 *
 * @property {boolean} BACKUP
 * Create backup copies before build.
 *
 * @property {boolean} EMAILS_BUILD
 * Enable emails build pipeline.
 *
 * @property {string} FOLDER_BUILD
 * Output build folder name.
 *
 * @property {string} SERVER_INDEX_PAGE
 * Entry HTML file for dev server.
 *
 * @property {boolean} OPTIMIZE_IMAGES
 * Enable image optimization.
 *
 * @property {boolean} PNG_OPTIMIZE
 * Enable PNG optimization.
 *
 * @property {boolean} PNG_SPRITE
 * Generate PNG sprites.
 *
 * @property {boolean} typeScript
 * Enable TypeScript support.
 *
 * @property {boolean} sourcemaps
 * Generate source maps.
 *
 * @property {string} sourceFolder
 * Source directory name.
 *
 * @property {string} developer
 * Environment name (dev / prod / etc).
 *
 * @property {string} assets
 * Assets folder path.
 *
 * @property {string} styleFileName
 * Base name for compiled CSS file.
 *
 * @property {string} imageFolderName
 * Images folder name.
 *
 * @property {'pug' | 'nunjucks' | 'twig'} templatePreproc
 * Template preprocessor.
 *
 * @property {Object} templateLocals
 * Locals passed to templates.
 *
 * @property {string} templateLocals.version
 * Project version for templates.
 *
 * @property {boolean} templateLocals.symbolsInject
 * Inject SVG symbols automatically.
 *
 * @property {string} templateLocals.pathPrefix
 * Static assets path prefix.
 *
 * @property {boolean} cssMinify
 * Minify compiled CSS.
 *
 * @property {boolean} htmlMinify
 * Minify HTML output.
 *
 * @property {Object} prettify
 * HTML prettify options.
 */

/** @type {BuildEnv} */
const env = {
    'PROJECT_VERSION': null,
    'BACKUP': true,
    'EMAILS_BUILD': true,
    'FOLDER_BUILD': 'build',
    'SERVER_INDEX_PAGE': 'index.html',
    'OPTIMIZE_IMAGES': true,
    'PNG_OPTIMIZE': true,
    'PNG_SPRITE': true,
    typeScript: false,
    sourcemaps: true,
    sourceFolder: 'src',
    developer: 'dev',
    assets: 'dev/assets',
    styleFileName: 'styles',
    imageFolderName: 'img',
    templatePreproc: 'pug',
    templateLocals: {
        version: '',
        symbolsInject: false,
        pathPrefix: '__static__'
    },
    cssMinify: true,
    htmlMinify: false,
    prettify: {
        'indent_char': ' ',
        'indent_size': 4,
        'indent_level': 1,
        'preserve_newlines': true,
        'max_preserve_newlines': 1
    }
};

export default env;
