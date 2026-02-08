import gulp from 'gulp';
import path from 'path';
import * as config from './config.js';
import { $, browser, reload } from './helper.js';
import {
    pngSprite,
    svgSprite
} from './images/images.js';
import {
    copy,
    html,
    scripts
} from '../gulpfile.js';
const { watch, series } = gulp;
const { SERVER_INDEX_PAGE, PNG_SPRITE } = config.argvMode;
const { developer, watchPath } = config;

const deleteEventFile = (filePath, resolve, src = config.sourceFolder) => {
    const sourcesFiles = path.relative(path.resolve(src), filePath);
    const destFiles = path.resolve(resolve, sourcesFiles);
    $.del.sync(destFiles);
};

const serveWatch = () => {
    browser.init({
        server: {
            baseDir: `./${developer}`,
            index: SERVER_INDEX_PAGE
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

    const runTemplates = series(html.templates(), scripts.styles, reload);

    watch(watchPath.templates, { delay: 0 })
        .on('all', (event, file) => {
            global.emittyPugChangedFile = event === 'unlink' ? undefined : file;
            runTemplates((err) => err && console.error(err));
        });

    watch(watchPath.data, html.data());
    watch(watchPath.email, html.emails());
    watch(watchPath.css, series(scripts.styles, reload));
    watch(watchPath.js.src, series(scripts.run, reload));

    watch(watchPath.js.vendor, series(copy.scriptsCopy, reload))
        .on('unlink', event => deleteEventFile(event, config.assets));

    watch(watchPath.assets, series(copy.assetsCopy, reload))
        .on('unlink', event => deleteEventFile(event, config.developer));

    watch(watchPath.files, series(copy.filesCopy, reload))
        .on('unlink', event => deleteEventFile(event, config.developer, `${config.sourceFolder}/assets/misc`));

    if (PNG_SPRITE) {
        watch(watchPath.sprite, series(pngSprite, reload));
    }

    watch(watchPath.svg, series(svgSprite, reload));
};

export default serveWatch;
