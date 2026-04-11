import gulp from 'gulp';
import path from 'path';
import * as config from './config.js';
import { $, browser, reload } from './helper.js';
import templateModule from './template/index.js';
import scriptsModule from './scripts.js';
import copyModule from './copy.js';
import imagesModule from './images/index.js';
import userConfig from '../user.config.js';
const { watch, series } = gulp;
const {
    serverIndexPage,
    spritePng,
    folderBuild,
    sourceFolder
} = userConfig;
const { watchPath } = config;
const { templates, data, emails } = templateModule;
const { styles, scripts } = scriptsModule;
const { svgSprite, pngSprite } = imagesModule;
const { assetsCopy } = copyModule;

const serveWatcher = () => {
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

    const deleteEventFile = (filePath, resolve, src = sourceFolder) => {
        const sourcesFiles = path.relative(path.resolve(src), filePath);
        const destFiles = path.resolve(resolve, sourcesFiles);
        $.del.sync(destFiles);
    };

    const runTemplates = series(templates(), styles, reload);

    watch(watchPath.templates, { delay: 0 })
        .on('all', (event, file) => {
            const isTemplateConfigChanged = file.includes('tmplConfig.js');

            global.emittyPugChangedFile = event === 'unlink' ? undefined : file;
            global.disableEmitty = isTemplateConfigChanged;

            runTemplates((err) => {
                global.disableEmitty = false;

                if (err) {
                    console.error(err);
                }
            });
        });

    watch(watchPath.data, data());
    watch(watchPath.email, emails());
    watch(watchPath.css, series(styles, reload));
    watch(watchPath.js.src, series(scripts, reload));

    watch(watchPath.assets, series(assetsCopy, reload))
        .on('unlink', event => deleteEventFile(event, folderBuild));

    if (spritePng) {
        watch(watchPath.sprite, series(pngSprite, reload));
    }

    watch(watchPath.svg, series(svgSprite, reload));
};

export default serveWatcher;
