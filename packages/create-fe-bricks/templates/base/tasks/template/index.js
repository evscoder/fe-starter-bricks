import gulp from 'gulp';
import { reload } from '../helper.js';
import dataModule from './data.js';
import templateTasks from './template.js';
const { parallel, series } = gulp;
const { dataRun } = dataModule;

const createTemplate = () => {
    const {
        templateCompile,
        emailsCompile
    } = templateTasks;

    const tasks = {
        templateRun: () => {
            return series(
                dataRun,
                parallel(
                    templateCompile,
                    emailsCompile
                )
            );
        },

        templates: () => {
            return templateCompile;
        },

        data: () => {
            return series(dataRun, reload);
        },

        emails: () => {
            return series(emailsCompile, reload);
        }
    };

    return tasks;
};

const templateModule = createTemplate();

export default templateModule;
