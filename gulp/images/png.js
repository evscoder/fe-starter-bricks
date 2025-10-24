import gulp from 'gulp';
import * as config from '../config.js';
import { $ } from '../helper.js';
const { src, dest } = gulp;
const { PNG_SPRITE } = config.argvMode;
let runSprite = true;

const pngSprite = done => {
    if (PNG_SPRITE) {
        if (runSprite) {
            runSprite = false;

            return src([
                `${config.imagesPath.spriteSrc}/*.png`
            ])
                .pipe($.spritesmith({
                    imgName: 'sprite.png',
                    retinaSrcFilter: `${config.imagesPath.spriteSrc}/*@2x.png`,
                    retinaImgName: 'sprite@2x.png',
                    retinaImgPath: `${config.imagesPath.dist}`,
                    cssName: '_sprite.scss',
                    algorithm: 'top-down',
                    padding: 2
                }))
                .pipe($.debug({ title: 'sprites' }))
                .pipe($.if(/[.]png$/, dest(`${config.imagesPath.src}`)))
                .pipe($.if(/[.]png$/, dest(`${config.imagesPath.dist}`)))
                .pipe(
                    $.if(/[.]scss$/, dest(config.imagesPath.spriteStylesDist))
                );
        }
    }

    return done();
};

export default pngSprite;
