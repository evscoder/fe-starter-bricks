import gulp from 'gulp';
import imageOptimizeModule from './image-optimize.js';
import pngSpriteModule from './png-sprite.js';
const { parallel, series } = gulp;
const { imageOptimize } = imageOptimizeModule;
const { pngSprite } = pngSpriteModule;

const createImages = () => {
    const tasks = {
        images: () => {
            return series(
                imageOptimize,
                parallel(
                    tasks.pngSprite
                )
            );
        },

        pngSprite
    };

    return tasks;
};

const imagesModule = createImages();

export default imagesModule;
