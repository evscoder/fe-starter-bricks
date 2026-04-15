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
    const copy = () => {
        return parallel(
            emailsCopy,
            assetsCopy
        );
    };

    const emailsCopy = (done) => {
        if (emailsBuild) {
            return src(`${emailPath.src}/assets/**/*`)
                .pipe(dest(emailPath.dist));
        }

        return done();
    };

    const assetsCopy = () => {
        return src(assetsSrc)
            .pipe($.newer(assetsBuild))
            .pipe($.debug({ title: 'Copy assets' }))
            .pipe(dest(assetsBuild));
    };

    return {
        copy,
        emailsCopy,
        assetsCopy
    };
};

const copyModule = createCopy();

export default copyModule;
