export default (templateLocals = {}) => {
    const PATH = templateLocals.pathPrefix || '';
    const ASSETS_FOLDER = 'assets';

    const staticPath = {
        css: `${PATH}${ASSETS_FOLDER}/css`,
        js: `${PATH}${ASSETS_FOLDER}/js`,
        img: `${PATH}${ASSETS_FOLDER}/img`
    };

    return {
        PATH,
        lang: 'ru',
        staticPath,
        links: {
            about: 'https://evstdev.vercel.app/about.html'
        },
        images: {
            logo: `${staticPath.img}/Logo.svg`
        }
    };
};
