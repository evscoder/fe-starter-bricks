import { createRequire } from 'module';
import gulp from 'gulp';
import { $ } from './helper.js';
import userConfig from '../user.config.js';
const { name, version } = createRequire(import.meta.url)('../package.json');
const { src, dest } = gulp;
const {
    projectVersion,
    backupBuild,
    folderBuild
} = userConfig;

const archive = done => {
    if (backupBuild) {
        const fileName = `${name}_v${projectVersion || version}`;
        const now = new Date();
        const year = now.getFullYear().toString().padStart(2, '0');
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');

        src(`${folderBuild}/**/*`)
            .pipe($.zip(`${fileName}_${year}-${month}-${day}_${hours}-${minutes}.zip`))
            .pipe(dest(folderBuild));
    }

    return done();
};

export default archive;
