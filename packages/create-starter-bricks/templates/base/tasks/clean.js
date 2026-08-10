import { $ } from './helper.js';
import userConfig from '../user.config.js';
const { folderBuild } = userConfig;

const createClean = () => {
    return {
        cleanBuild: () => {
            return $.del([
                `${folderBuild}/**/*`
            ]);
        }
    };
};

const cleanModule = createClean();

export default cleanModule;
