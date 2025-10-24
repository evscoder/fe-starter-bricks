import gulp from 'gulp';
import HTML from './gulp/html/html.js';
import Scripts from './gulp/js.js';
import IMAGES from './gulp/images/images.js';
import Copy from './gulp/copy.js';
import serveWatch from './gulp/watch.js';
import Clean from './gulp/clean.js';
import zip from './gulp/zip.js';
const { task, series, parallel } = gulp;

task('default', series(
    Clean.cleanDev,
    Copy.tasks(),
    IMAGES.tasks(),
    parallel(
        HTML.tasks(),
        Scripts.styles,
        Scripts.run
    ),
    serveWatch
));

task('build', series(
    Clean.cleanDev,
    Copy.tasks(),
    IMAGES.tasks(),
    parallel(
        HTML.tasks(),
        Scripts.styles,
        Scripts.run
    ),
    Clean.cleanBuild,
    Copy.copyBuild,
    zip
));
