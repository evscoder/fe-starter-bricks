import createFactory from '../utils/create-factory.js';
const createUi = () => {
    const factory = createFactory();

    return {
        onInit: () => {
        },
        destroy: () => {
            factory.destroy();
        }
    };
};
const uiModules = () => {
    const factory = createUi();
    factory.onInit();
    return factory;
};
export default uiModules;
