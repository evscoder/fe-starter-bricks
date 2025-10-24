import gulp from 'gulp';
import { reload } from '../helper.js';
import Data from './data.js';
import Template from './template.js';
const { parallel, series } = gulp;

export default class HTML {
    static tasks() {
        return series(
            Data.dataRun,
            parallel(
                Template.htmlCompile,
                Template.emailsCompile
            )
        );
    }

    static templates() {
        return Template.htmlCompile;
    }

    static data() {
        return series(Data.dataRun, reload);
    }

    static emails() {
        return series(Template.emailsCompile, reload);
    }
}
