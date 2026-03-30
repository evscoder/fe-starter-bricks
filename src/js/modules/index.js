import createFactory from '../utils/create-factory.js';
import Header from '../../components/layout/header/header.js';

const createModules = () => {
    const factory = createFactory();

    const onInit = () => {
        factory.create(Header);
    };

    return {
        onInit,
        destroy: factory.destroy
    };
};

const modulesComponent = () => {
    const factory = createModules();
    factory.onInit();

    return factory;
};

export default modulesComponent;
