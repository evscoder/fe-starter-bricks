import userConfig from '../user.config.js';
const {
    sourceFolder,
    styleFileName,
    assetsBuild,
    imageFolderName,
    typeScript,
    folderBuild,
    templateEngine
} = userConfig;
export const isProduction = process.env.NODE_ENV === 'production';

export const loadPlugins = {
    pattern: ['gulp-*', 'gulp.*', 'browser-*', 'imagemin-*', 'main-*', 'run-*', 'require-*', 'stream-*', 'event-*', 'browser-sync', 'postcss-*', 'webpack', 'webpack-*', 'autoprefixer', 'del'],
    replaceString: /^gulp(-|\.)/,
    lazy: true,
    camelize: true
};

const templateDataFileName = '__snapshot-data-components__.json';
const scriptExt = typeScript ? 'ts' : 'js';

const getTemplateExt = () => {
    switch (templateEngine) {
        case 'pug':
            return 'pug';
        case 'nunjucks':
            return '{njk,html}';
        case 'twig':
            return '{twig,html.twig}';
        default:
            break;
    }

    return 'pug';
};

const templateExt = getTemplateExt();

export const templatePath = {
    src: [
        `${sourceFolder}/templates/pages/**/[^_]*.${templateExt}`
    ],
    dataFileName: templateDataFileName,
    dataFiles: [
        `${sourceFolder}/templates/**/*.json`
    ],
    dataDist: `.cache/`,
    dist: `${folderBuild}/`
};

export const emailPath = {
    src: `${sourceFolder}/templates/emails`,
    filesSrc: `${sourceFolder}/templates/emails/[^_]*.mjml`,
    dist: `${folderBuild}/emails/`
};

export const stylesPath = {
    entry: {
        styles: `./${sourceFolder}/${scriptExt}/${styleFileName}.${scriptExt}`
    },
    dist: `../../${assetsBuild}/js/`
};

export const webpackPath = {
    entry: {
        main: `./${sourceFolder}/${scriptExt}/main.${scriptExt}`
    },
    output: `../../${assetsBuild}/js/`
};

export const imagesPath = {
    src: `${sourceFolder}/assets/${imageFolderName}`,
    spriteSrc: `${sourceFolder}/assets/${imageFolderName}/sprite`,
    spriteStylesDist: `${sourceFolder}/styles/plugins`,
    svgSrc: `${sourceFolder}/assets/${imageFolderName}/svg`,
    dist: `${assetsBuild}/${imageFolderName}/`
};

export const watchPath = {
    templates: [
        `${sourceFolder}/templates/**/[^_]*.${templateExt}`,
        `${sourceFolder}/tmplConfig.js`
    ],
    data: [
        `${sourceFolder}/templates/**/*.json`
    ],
    email: `${sourceFolder}/templates/emails/**/*.mjml`,
    css: `${sourceFolder}/**/*.scss`,
    js: {
        src: [
            `${sourceFolder}/${scriptExt}/**/*.${scriptExt}`
        ]
    },
    sprite: `${imagesPath.src}/content/sprite/**/*.png`,
    svg: `${imagesPath.src}/svg/**/*.svg`,
    assets: `${sourceFolder}/assets/**/*`
};
