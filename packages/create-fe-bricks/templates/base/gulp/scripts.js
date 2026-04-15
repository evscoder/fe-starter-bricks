import gulp from 'gulp';
import * as config from './config.js';
import { $, notifyErr } from './helper.js';
import { stylesConfig } from './webpack/webpack.styles.config.js';
import { webpackConfig } from './webpack/webpack.config.js';
const { src, dest } = gulp;
const { entry: stylesEntry } = config.stylesPath;
const { entry: scriptsEntry } = config.webpackPath;

const getEntryPaths = (entry) => {
    const entryPaths = [];

    Object.entries(entry).forEach(([, value]) => entryPaths.push(value));

    return entryPaths;
};

const createScripts = () => {
    const styles = () => {
        return src(getEntryPaths(stylesEntry))
            .pipe($.plumber(notifyErr()))
            .pipe($.webpackStream(stylesConfig))
            .pipe(dest(stylesConfig.output.path));
    };

    const scripts = () => {
        return src(getEntryPaths(scriptsEntry))
            .pipe($.plumber(notifyErr()))
            .pipe($.webpackStream(webpackConfig))
            .pipe(dest(webpackConfig.output.path));
    };

    return {
        styles,
        scripts
    };
};

const scriptsModule = createScripts();

export default scriptsModule;
