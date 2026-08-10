import gulp from 'gulp';
import * as config from './config.js';
import { $ } from './helper.js';
import userConfig from '../user.config.js';
import { emailPath, isProduction } from './config.js';
const { src, dest, parallel } = gulp;
const {
    sourceFolder,
    emailsBuild,
    optimizeImages,
    assetsBuild
} = userConfig;

const assetsSrc = [
    `${sourceFolder}/assets/**/*`
];

if (optimizeImages && isProduction) {
    assetsSrc.push(`!${config.imagesPath.src}/**`);
}

const createCopy = () => {
    const tasks = {
        copy: () => {
            return parallel(
                tasks.emailsCopy,
                tasks.assetsCopy
            );
        },

        emailsCopy: (done) => {
            if (emailsBuild) {
                return src(`${emailPath.src}/assets/**/*`)
                    .pipe(dest(emailPath.dist));
            }

            return done();
        },

        assetsCopy: () => {
            return src(assetsSrc)
                .pipe($.newer(assetsBuild))
                .pipe($.debug({ title: 'Copy assets' }))
                .pipe(dest(assetsBuild));
        }
    };

    return tasks;
};

const copyModule = createCopy();

export default copyModule;
