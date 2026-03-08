export default (templateLocals = {}) => {
    const PATH = templateLocals.pathPrefix || '';
    const staticPath = {
        css: `${PATH}assets/css`,
        js: `${PATH}assets/js`,
        img: `${PATH}assets/img`
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
