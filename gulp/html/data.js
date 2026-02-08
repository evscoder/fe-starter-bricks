import gulp from 'gulp';
import fs from 'fs';
import * as config from '../config.js';
import { $ } from '../helper.js';
const { src, dest } = gulp;
const { dataFileName, dataFiles, distComponents } = config.template;

export default class Data {
    dataRun = () => {
        return src(dataFiles)
            .pipe($.mergeJson({ fileName: dataFileName }))
            .pipe(dest(distComponents));
    };

    parser = () => {
        return JSON.parse(fs.readFileSync(distComponents + dataFileName, 'utf8'));
    };
}
