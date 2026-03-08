import gulp from 'gulp';
import * as config from './config.js';
import { $ } from './helper.js';
const { src, dest, parallel } = gulp;
const { EMAILS_BUILD, OPTIMIZE_IMAGES } = config.argvMode;
const { production } = config.argvMode.env;
const assetsSrc = [
    `${config.sourceFolder}/assets/**/*`
];

if (OPTIMIZE_IMAGES && production) {
    assetsSrc.push(`!${config.imagesPath.src}/**`);
}

export default class Copy {
    copyTasks = () => {
        return parallel(
            this.emailsCopy,
            this.assetsCopy
        );
    };

    emailsCopy = (done) => {
        if (EMAILS_BUILD) {
            return src(`${config.email.src}/assets/**/*`)
                .pipe(dest(config.email.dist));
        }

        return done();
    };

    assetsCopy = () => {
        return src(assetsSrc)
            .pipe($.newer(config.assets))
            .pipe($.debug({ title: 'assets' }))
            .pipe(dest(config.assets));
    };

    copyBuild = () => {
        return src(`${config.developer}/**/*`)
            .pipe(dest(config.production));
    };
}
