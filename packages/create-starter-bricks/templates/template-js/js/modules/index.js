import createFactory from '../utils/create-factory.js';
import Header from './header.js';
const createModules = () => {
    const factory = createFactory();

    return {
        onInit: () => {
            factory.create(Header);
        },
        destroy: () => {
            factory.destroy();
        }
    };
};

const initModules = () => {
    const factory = createModules();
    factory.onInit();
    return factory;
};

export default initModules;
