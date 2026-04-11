import userConfig from '../../user.config.js';
import { isProduction } from '../config.js';

export const envCreate = () => {
    const sourceMap = userConfig.sourcemaps ? true : !isProduction;
    let devtool;

    if (userConfig.sourcemaps) {
        devtool = 'source-map';
    } else if (isProduction) {
        devtool = false;
    } else {
        devtool = 'source-map';
    }

    return { sourceMap, devtool };
};

const envModule = envCreate();

export default envModule;
