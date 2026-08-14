import fs from 'node:fs';
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
import {stylesPath, webpackPath} from "./config.js";

const {
    watch,
    series
} = gulp;

const {
    serverIndexPage,
    spritePng,
    folderBuild,
    assetsBuild,
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

const stylesEntryName = Object.keys(stylesPath.entry)[0];
const scriptEntryName = Object.keys(webpackPath.entry)[0];

const webpackOutputFiles = [
    path.resolve(assetsBuild, `css/${stylesEntryName}.css`),
    path.resolve(assetsBuild, `js/${scriptEntryName}.js`),
    path.resolve(assetsBuild, 'img/symbols.svg')
];

const printReadyMessage = () => {
    const lines = [
        '',
        '\x1b[32m╭──────────────────────────────────────╮\x1b[0m',
        '\x1b[32m│\x1b[0m  \x1b[1;32m✔ Project started successfully\x1b[0m            \x1b[32m│\x1b[0m',
        '\x1b[32m│\x1b[0m                                      \x1b[32m│\x1b[0m',
        '\x1b[32m│\x1b[0m  \x1b[90mLocal:\x1b[0m   \x1b[1;36mhttp://localhost:4200\x1b[0m      \x1b[32m│\x1b[0m',
        '\x1b[32m╰──────────────────────────────────────╯\x1b[0m',
        ''
    ];

    console.log(lines.join('\n'));
};

const waitForWebpack = () => {
    let messageShown = false;

    const timeout = 60_000;
    const interval = 100;
    const startedAt = Date.now();

    const timer = setInterval(() => {
        const webpackIsReady = webpackOutputFiles.every(file => {
            return fs.existsSync(file);
        });

        if (webpackIsReady && !messageShown) {
            messageShown = true;

            clearInterval(timer);
            printReadyMessage();

            return;
        }

        const timedOut = Date.now() - startedAt >= timeout;

        if (timedOut) {
            clearInterval(timer);

            console.warn(
                [
                    '',
                    'Webpack readiness timeout.',
                    ...webpackOutputFiles.map(file => {
                        return `- ${file}`;
                    }),
                    ''
                ].join('\n')
            );
        }
    }, interval);
};

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
                    ui: false
                },

                error => {
                    if (error) {
                        console.error(
                            'BrowserSync start error:',
                            error
                        );

                        return;
                    }

                    waitForWebpack();
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

            watch(
                watchPath.templates,
                {
                    delay: 0
                }
            ).on('all', (event, file) => {
                const isTemplateConfigChanged = file.includes('tmplConfig.js');

                global.emittyPugChangedFile = event === 'unlink' ? undefined : file;

                global.disableEmitty = isTemplateConfigChanged;

                runTemplates(error => {
                    global.disableEmitty = false;

                    if (error) {
                        console.error(error);
                    }
                });
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
