import gulp from 'gulp';
import serveWatcher from './gulp/watcher.js';
import archive from './gulp/archive.js';
import cleanModule from './gulp/clean.js';
import copyModule from './gulp/copy.js';
import imagesModule from './gulp/images/index.js';
import templateModule from './gulp/template/index.js';
import scriptsModule from './gulp/scripts.js';
const { task, series, parallel } = gulp;
const { cleanBuild } = cleanModule;
const { copy } = copyModule;
const { images } = imagesModule;
const { templateRun } = templateModule;
const { styles, scripts } = scriptsModule;

task('default', series(
    cleanBuild,
    copy(),
    images(),
    parallel(
        templateRun(),
        styles,
        scripts
    ),
    serveWatcher
));

task('build', series(
    cleanBuild,
    copy(),
    images(),
    parallel(
        templateRun(),
        styles,
        scripts
    ),
    archive
));
