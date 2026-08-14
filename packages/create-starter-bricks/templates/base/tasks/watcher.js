import gulp from 'gulp';
import path from 'node:path';

import * as config from './config.js';
import { $, browser, reload } from './helper.js';

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
            browser.init({
                server: {
                    baseDir: `./${folderBuild}`,
                    index: serverIndexPage
                },

                watchOptions: {
                    ignoreInitial: true
                },

                open: false,
                tunnel: false,
                online: false,
                port: 4200,
                notify: true,
                logConnections: true,
                ui: false
            });

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

                runTemplates(err => {
                    global.disableEmitty = false;

                    if (err) {
                        console.error(err);
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
