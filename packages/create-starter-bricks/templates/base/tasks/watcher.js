import path from 'node:path';
import gulp from 'gulp';

import * as config from './config.js';
import {
    $,
    browser,
    reload
} from './helper.js';

import templateModule from './template/index.js';
import copyModule from './copy.js';
import imagesModule from './images/index.js';
import userConfig from '../user.config.js';

const {
    watch,
    series
} = gulp;

const {
    serverIndexPage,
    spritePng,
    folderBuild,
    sourceFolder
} = userConfig;

const {
    watchPath
} = config;

const {
    templates,
    data,
    emails
} = templateModule;

const {
    pngSprite
} = imagesModule;

const {
    assetsCopy
} = copyModule;

const createWatcher = () => {
    return {
        serveWatcher: () => {
            browser.init(
                {
                    server: {
                        baseDir: `./${folderBuild}`,
                        index: serverIndexPage
                    },
                    open: false,
                    online: false,
                    port: 4200,
                    notify: true,
                    logConnections: false,
                    ui: false,
                    logLevel: 'silent'
                },

                (error, instance) => {
                    if (error) {
                        console.error(
                            'BrowserSync failed to start:',
                            error
                        );

                        return;
                    }

                    const localUrl = instance.options.getIn([
                        'urls',
                        'local'
                    ]);

                    console.log('');

                    console.log(
                        '\x1b[32m%s\x1b[0m',
                        '╭──────────────────────────────────────╮'
                    );

                    console.log(
                        '\x1b[32m│\x1b[0m  '
                        + '\x1b[1;32m✔ Project started successfully\x1b[0m'
                        + '       '
                        + '\x1b[32m│\x1b[0m'
                    );

                    console.log(
                        '\x1b[32m│\x1b[0m'
                        + '                                      '
                        + '\x1b[32m│\x1b[0m'
                    );

                    console.log(
                        '\x1b[32m│\x1b[0m  '
                        + '\x1b[90mLocal:\x1b[0m '
                        + `\x1b[1;36m${localUrl}\x1b[0m`
                    );

                    console.log(
                        '\x1b[32m%s\x1b[0m',
                        '╰──────────────────────────────────────╯'
                    );

                    console.log('');
                }
            );

            const deleteEventFile = (
                filePath,
                resolve,
                src = sourceFolder
            ) => {
                const sourcesFiles = path.relative(
                    path.resolve(src),
                    filePath
                );

                const destFiles = path.resolve(
                    resolve,
                    sourcesFiles
                );

                $.del.sync(destFiles);
            };

            const runTemplates = series(
                templates(),
                reload
            );

            const pendingTemplateChanges = new Set();
            let templateConfigChanged = false;

            watch(
                watchPath.templates,
                {
                    delay: 100
                },
                done => {
                    global.templateChangedFiles = [...pendingTemplateChanges];
                    global.disableTemplateIncremental = templateConfigChanged;
                    pendingTemplateChanges.clear();
                    templateConfigChanged = false;

                    runTemplates(error => {
                        global.templateChangedFiles = [];
                        global.disableTemplateIncremental = false;
                        done(error);
                    });
                }
            ).on('all', (event, file) => {
                if (path.basename(file) === 'tmplConfig.js') {
                    templateConfigChanged = true;
                } else {
                    pendingTemplateChanges.add(file);
                }

                if (event === 'unlink') {
                    const page = path.relative(
                        path.resolve(sourceFolder, 'templates/pages'),
                        path.resolve(file)
                    );
                    const isPage = page !== '..'
                        && !page.startsWith(`..${path.sep}`)
                        && !path.isAbsolute(page)
                        && !path.basename(page).startsWith('_');
                    const extension = /(?:\.html\.twig|\.(?:twig|pug|njk|html))$/i;

                    if (isPage && extension.test(page)) {
                        $.del.sync(path.resolve(folderBuild, page.replace(extension, '.html')));
                    }
                }
            });

            watch(
                watchPath.data,
                data()
            );

            watch(
                watchPath.email,
                emails()
            );

            watch(
                watchPath.assets,
                series(
                    assetsCopy,
                    reload
                )
            ).on('unlink', filePath => {
                deleteEventFile(
                    filePath,
                    folderBuild
                );
            });

            if (spritePng) {
                watch(
                    watchPath.sprite,
                    series(
                        pngSprite,
                        reload
                    )
                );
            }

            watch(
                watchPath.webpackBuildPaths,
                {
                    delay: 100,
                    ignoreInitial: true
                },
                reload
            );
        }
    };
};

const watcherModule = createWatcher();

export default watcherModule;
