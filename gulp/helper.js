import { createRequire } from 'module';
import { loadPlugins } from './config.js';
const plugins = createRequire(import.meta.url)('gulp-load-plugins');
const $ = plugins(loadPlugins);
const browser = $.browserSync.create();

const reload = done => {
    browser.reload();
    done();
};

const notifyErr = title => {
    return $.notify.onError(err => {
        let msg = err.message || '';

        const match = msg.match(/(Error:[^\n]+|Undefined[^\n]+)/i);
        let shortMessage = match ? match[0] : msg.split('\n')[0];

        return {
            title: title,
            message: shortMessage.trim()
        };
    });
};

export {
    $,
    browser,
    reload,
    notifyErr
};
