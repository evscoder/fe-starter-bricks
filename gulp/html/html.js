import gulp from 'gulp';
import { reload } from '../helper.js';
import Data from './data.js';
import Template from './template.js';
const { parallel, series } = gulp;

export default class Html {
    constructor() {
        this.templateComponent = new Template();
        this.dataComponent = new Data();
    }

    htmlTasks = () => {
        return series(
            this.dataComponent.dataRun,
            parallel(
                this.templateComponent.htmlCompile,
                this.templateComponent.emailsCompile
            )
        );
    };

    templates = () => {
        return this.templateComponent.htmlCompile;
    };

    data = () => {
        return series(this.dataComponent.dataRun, reload);
    };

    emails = () => {
        return series(this.templateComponent.emailsCompile, reload);
    };
}
