import imagesLoaded from 'imagesloaded';

const imageReady = (el, cb) => {
    const container = imagesLoaded(el);

    container.on('always', cb);
};

export default imageReady;
