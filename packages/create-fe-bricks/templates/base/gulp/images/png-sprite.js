import gulp from 'gulp';
import * as config from '../config.js';
import { $ } from '../helper.js';
import userConfig from '../../user.config.js';
const { src, dest } = gulp;
const { spritePng } = userConfig;
let runSprite = true;

const pngSprite = done => {
    if (spritePng && runSprite) {
        runSprite = false;

        return src([
            `${config.imagesPath.spriteSrc}/*.png`
        ])
            .pipe($.spritesmith({
                imgName: 'sprite.png',
                retinaSrcFilter: `${config.imagesPath.spriteSrc}/*@2x.png`,
                retinaImgName: 'sprite@2x.png',
                retinaImgPath: `${config.imagesPath.dist}`,
                cssName: 'sprite.scss',
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

    return done();
};

export default pngSprite;
