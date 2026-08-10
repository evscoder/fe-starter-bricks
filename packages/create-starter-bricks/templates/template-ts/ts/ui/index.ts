import createFactory from '../utils/create-factory';
import { IFactory } from '../interfaces/factory';

const createUi = (): IFactory => {
    const factory = createFactory();

    const onInit = (): void => {
    };

    return {
        onInit,
        destroy: factory.destroy
    };
};

const uiComponent = (): IFactory => {
    const factory = createUi();
    factory.onInit();

    return factory;
};

export default uiComponent;
