import gulp from 'gulp';
import imageOptimize from './image-optimize.js';
import pngSprite from './png-sprite.js';
import svgSprite from './svg-sprite.js';
const { parallel, series } = gulp;

const createImages = () => {
    const images = () => series(
        imageOptimize,
        parallel(
            pngSprite,
            svgSprite
        )
    );

    return {
        images,
        pngSprite,
        svgSprite
    };
};

const imagesModule = createImages();

export default imagesModule;
