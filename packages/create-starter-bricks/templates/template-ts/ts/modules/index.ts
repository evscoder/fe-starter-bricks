import createFactory from '../utils/create-factory';
import Header from './header';
import { IFactory } from '../interfaces/factory';

const createModules = (): IFactory => {
    const factory = createFactory();

    return {
        onInit: (): void => {
            factory.create(Header);
        },
        destroy: (): void => {
            factory.destroy();
        }
    };
};

const modulesComponent = (): IFactory => {
    const factory = createModules();

    factory.onInit();

    return factory;
};

export default modulesComponent;
