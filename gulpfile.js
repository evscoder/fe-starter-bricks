import gulp from 'gulp';
import Scripts from './gulp/js.js';
import Copy from './gulp/copy.js';
import serveWatch from './gulp/watch.js';
import Clean from './gulp/clean.js';
import Images from './gulp/images/images.js';
import Html from './gulp/html/html.js';
import archivePack from './gulp/archivePack.js';

const { task, series, parallel } = gulp;

export const copy = new Copy();
export const html = new Html();
export const scripts = new Scripts();

const clean = new Clean();
const images = new Images();

const cleanDev = clean.cleanDev;
const cleanBuild = clean.cleanBuild;
const copyTasks = copy.copyTasks;
const copyBuild = copy.copyBuild;
const imagesTasks = images.tasks;
const htmlTasks = html.htmlTasks;
const styles = scripts.styles;
const scriptsRun = scripts.run;

task('default', series(
    cleanDev,
    copyTasks(),
    imagesTasks(),
    parallel(
        htmlTasks(),
        styles,
        scriptsRun
    ),
    serveWatch
));

task('build', series(
    cleanDev,
    copyTasks(),
    imagesTasks(),
    parallel(
        htmlTasks(),
        styles,
        scriptsRun
    ),
    cleanBuild,
    copyBuild,
    archivePack
));
