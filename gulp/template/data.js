import gulp from 'gulp';
import fs from 'fs';
import { $ } from '../helper.js';
import { templatePath } from '../config.js';
const { src, dest } = gulp;
const {
    dataFileName,
    dataFiles,
    dataDist
} = templatePath;

const createData = () => {
    const dataRun = () => {
        return src(dataFiles)
            .pipe($.mergeJson({ fileName: dataFileName }))
            .pipe(dest(dataDist));
    };

    const dataParser = () => {
        return JSON.parse(fs.readFileSync(dataDist + dataFileName, 'utf8'));
    };

    return {
        dataRun,
        dataParser
    };
};

const dataModule = createData();

export default dataModule;
