import createFactory from '../utils/create-factory';
import { IFactory } from '../interfaces/factory';

const createUi = (): IFactory => {
    const factory = createFactory();

    return {
        onInit: (): void => {
        },
        destroy: (): void => {
            factory.destroy();
        }
    };
};

const uiModules = (): IFactory => {
    const factory = createUi();
    factory.onInit();
    return factory;
};

export default uiModules;

