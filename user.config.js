/**
 * Global build environment configuration
 * @typedef {Object} userConfig
 *
 * @property {string|null} projectVersion
 * Project version.
 * If `null` — default version ("1.0").
 *
 * @property {boolean} backupBuild
 * Create backupBuild copies before build.
 *
 * @property {boolean} emailsBuild
 * Enable emails build pipeline.
 *
 * @property {string} folderBuild
 * Output build folder name.
 *
 * @property {string} serverIndexPage
 * Entry HTML file for dev server.
 *
 * @property {boolean} optimizeImages
 * Enable image optimization.
 *
 * @property {boolean} optimizePng
 * Enable PNG optimization.
 *
 * @property {boolean} spritePng
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
 * @property {string} assetsBuild
 * Assets folder path.
 *
 * @property {string} styleFileName
 * Base name for compiled CSS file.
 *
 * @property {string} imageFolderName
 * Images folder name.
 *
 * @property {'pug' | 'nunjucks' | 'twig'} templateEngine
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
 * @property {boolean} htmlMinify
 * Minify HTML output.
 *
 * @property {Object} prettify
 * HTML prettify options.
 */

/** @type {userConfig} */
const userConfig = {
    projectVersion: null,
    backupBuild: false,
    serverIndexPage: 'index.html',
    optimizeImages: true,
    optimizePng: true,
    spritePng: false,
    emailsBuild: true,
    folderBuild: 'build',
    assetsBuild: 'build/assets',
    typeScript: true,
    sourcemaps: false,
    sourceFolder: 'src',
    styleFileName: 'styles',
    imageFolderName: 'img',
    templateEngine: 'pug',
    templateLocals: {
        version: '',
        symbolsInject: false,
        pathPrefix: '__static__'
    },
    htmlMinify: false,
    prettify: {
        'indent_char': ' ',
        'indent_size': 4,
        'indent_level': 1,
        'preserve_newlines': true,
        'max_preserve_newlines': 1
    }
};

export default userConfig;
