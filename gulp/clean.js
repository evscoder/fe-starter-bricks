import { developer, production } from './config.js';
import { $ } from './helper.js';

export default class Clean {
    cleanDev = () => {
        return $.del([
            `${developer}/**/*`
        ]);
    };

    cleanBuild = () => {
        return $.del([
            `./*.zip`,
            `${developer}/ts/`,
            `${production}/**/*`
        ]);
    };
}
