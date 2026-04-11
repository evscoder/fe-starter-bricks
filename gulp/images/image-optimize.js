import gulp from 'gulp';
import * as config from '../config.js';
import { $ } from '../helper.js';
import imagemin, {
    gifsicle,
    mozjpeg,
    optipng
} from 'gulp-imagemin';
const { src, dest } = gulp;
import userConfig from '../../user.config.js';
const { optimizeImages, optimizePng } = userConfig;

const imageOptimize = done => {
    if (optimizeImages) {
        return src(`${config.imagesPath.src}/**/*.*`)
            .pipe($.newer(config.imagesPath.dist))
            .pipe($.debug({ title: 'images' }))
            .pipe(imagemin([
                gifsicle({
                    interlaced: true
                }),
                mozjpeg({
                    quality: 80,
                    progressive: true
                })
            ]))
            .pipe($.if(optimizePng, imagemin([
                optipng({
                    optimizationLevel: 1
                })
            ])))
            .pipe($.if(/[.]svg$/, $.svgmin(() => {
                return {
                    js2svg: {
                        pretty: true,
                        indent: '\t'
                    },
                    plugins: [
                        {
                            cleanupIDs: false
                        }, {
                            removeViewBox: false
                        }, {
                            convertPathData: false
                        }, {
                            mergePaths: false
                        }
                    ]
                };
            })))
            .pipe(dest(config.imagesPath.dist));
    }

    return done();
};

export default imageOptimize;
