import gulp from 'gulp';
import imageOptimizeModule from './image-optimize.js';
import pngSpriteModule from './png-sprite.js';
import svgSpriteModule from './svg-sprite.js';
const { parallel, series } = gulp;
const { imageOptimize } = imageOptimizeModule;
const { pngSprite } = pngSpriteModule;
const { svgSprite } = svgSpriteModule;

const createImages = () => {
    const tasks = {
        images: () => {
            return series(
                imageOptimize,
                parallel(
                    tasks.pngSprite,
                    tasks.svgSprite
                )
            );
        },

        pngSprite,
        svgSprite
    };

    return tasks;
};

const imagesModule = createImages();

export default imagesModule;
