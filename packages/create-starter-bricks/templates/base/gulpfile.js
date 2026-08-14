import gulp from 'gulp';
import watcherModule from './tasks/watcher.js';
import archiveModule from './tasks/archive.js';
import cleanModule from './tasks/clean.js';
import copyModule from './tasks/copy.js';
import imagesModule from './tasks/images/index.js';
import templateModule from './tasks/template/index.js';
const { task, series, parallel } = gulp;
const { serveWatcher } = watcherModule;
const { archive } = archiveModule;
const { cleanBuild } = cleanModule;
const { copy } = copyModule;
const { images } = imagesModule;
const { templateRun } = templateModule;

task('default', series(
    cleanBuild,
    copy(),
    images(),
    parallel(
        templateRun()
    ),
    serveWatcher
));

task('build', series(
    cleanBuild,
    copy(),
    images(),
    parallel(
        templateRun()
    ),
    archive
));
