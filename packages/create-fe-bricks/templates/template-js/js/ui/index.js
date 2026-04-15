import createFactory from '../utils/create-factory.js';
const createUi = () => {
    const factory = createFactory();
    const onInit = () => {
    };
    return {
        onInit,
        destroy: factory.destroy
    };
};
const uiComponent = () => {
    const factory = createUi();
    factory.onInit();
    return factory;
};
export default uiComponent;
