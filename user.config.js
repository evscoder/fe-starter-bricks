const env = {
    'PROJECT_VERSION': null, // @Default version "1.0"
    'BACKUP': true,
    'EMAILS_BUILD': true,
    'FOLDER_BUILD': 'build',
    'SERVER_INDEX_PAGE': 'index.html',
    'OPTIMIZE_IMAGES': true,
    'PNG_OPTIMIZE': true,
    'PNG_SPRITE': true,
    typeScript: false,
    sourcemaps: false,
    sourceFolder: 'src',
    developer: 'dev',
    assets: 'dev/assets',
    styleFileName: 'styles',
    imageFolderName: 'img',
    templatePreproc: 'pug', // @String = 'pug' | 'nunjucks'
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
