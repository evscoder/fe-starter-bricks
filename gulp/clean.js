import { developer, production } from './config.js';
import { $ } from './helper.js';

export default class Clean {
    static cleanDev() {
        return $.del([
            `${developer}/**/*`
        ]);
    }

    static cleanBuild() {
        return $.del([
            `./*.zip`,
            `${developer}/ts/`,
            `${production}/**/*`
        ]);
    }
}
