import { $ } from './helper.js';
import userConfig from '../user.config.js';
const { folderBuild } = userConfig;

const createClean = () => {
    const cleanBuild = () => {
        return $.del([
            `${folderBuild}/**/*`
        ]);
    };

    return {
        cleanBuild
    };
};

const cleanModule = createClean();

export default cleanModule;
