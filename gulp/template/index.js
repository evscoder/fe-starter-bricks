import gulp from 'gulp';
import { reload } from '../helper.js';
import dataModule from './data.js';
import template from './template.js';
const { parallel, series } = gulp;
const { dataRun } = dataModule;

const createTemplate = () => {
    const {
        templateCompile,
        emailsCompile
    } = template();

    const templateRun = () => {
        return series(
            dataRun,
            parallel(
                templateCompile,
                emailsCompile
            )
        );
    };

    const templates = () => {
        return templateCompile;
    };

    const data = () => {
        return series(dataRun, reload);
    };

    const emails = () => {
        return series(emailsCompile, reload);
    };

    return {
        templateRun,
        templates,
        data,
        emails
    };
};

const templateModule = createTemplate();

export default templateModule;
