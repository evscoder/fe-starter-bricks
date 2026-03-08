import userConfig from '../user.config.js';

export const argvMode = {
    ...userConfig,
    env: {
        production: process.env.NODE_ENV === 'production'
    }
};

export const {
    sourceFolder,
    developer,
    assets,
    FOLDER_BUILD: production,
    styleFileName,
    imageFolderName
} = argvMode;

export const loadPlugins = {
    pattern: ['gulp-*', 'gulp.*', 'browser-*', 'imagemin-*', 'main-*', 'run-*', 'require-*', 'stream-*', 'event-*', 'browser-sync', 'postcss-*', 'webpack', 'webpack-*', 'autoprefixer', 'del'],
    replaceString: /^gulp(-|\.)/,
    lazy: true,
    camelize: true
};

const templateDataFileName = '__snapshot-data-components__.json';
const scriptExt = argvMode.typeScript ? 'ts' : 'js';

const getTemplateExt = (() => {
    switch (argvMode.templatePreproc) {
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
})();

export const template = {
    src: [
        `${sourceFolder}/pages/**/[^_]*.${getTemplateExt}`,
        `!${sourceFolder}/**/{components,templates}/**/*.${getTemplateExt}`
    ],
    dataFileName: templateDataFileName,
    dataFiles: [
        `${sourceFolder}/components/**/*.json`
    ],
    distComponents: `cache/`,
    dist: `${developer}/`
};

export const email = {
    src: `${sourceFolder}/emails`,
    filesSrc: `${sourceFolder}/emails/[^_]*.mjml`,
    dist: `${developer}/emails/`
};

export const stylesPath = {
    entry: {
        styles: `./${sourceFolder}/js/${styleFileName}.${scriptExt}`
    },
    dist: `../${assets}/js/`
};

export const webpackPath = {
    entry: {
        main: `./${sourceFolder}/js/main.${scriptExt}`
    },
    output: `../${assets}/js/`
};

export const imagesPath = {
    src: `${sourceFolder}/assets/${imageFolderName}`,
    spriteSrc: `${sourceFolder}/assets/${imageFolderName}/sprite`,
    spriteStylesDist: `${sourceFolder}/styles/plugins`,
    svgSrc: `${sourceFolder}/assets/${imageFolderName}/svg`,
    dist: `${assets}/${imageFolderName}/`
};

export const watchPath = {
    templates: [
        `${sourceFolder}/**/[^_]*.${getTemplateExt}`,
        `${sourceFolder}/components/tmplConfig.js`
    ],
    data: [
        `${sourceFolder}/components/**/*.json`,
        `!${sourceFolder}/components/**/${templateDataFileName}`
    ],
    email: `${sourceFolder}/emails/**/*.mjml`,
    css: `${sourceFolder}/**/*.scss`,
    js: {
        src: [
            `${sourceFolder}/**/*.${scriptExt}`,
            `!${sourceFolder}/components/tmplConfig.js`
        ]
    },
    sprite: `${imagesPath.src}/content/sprite/**/*.png`,
    svg: `${imagesPath.src}/svg/**/*.svg`,
    assets: `${sourceFolder}/assets/**/*`
};
