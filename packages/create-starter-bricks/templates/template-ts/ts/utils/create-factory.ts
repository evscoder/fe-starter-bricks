import { IFactory } from '../interfaces/factory';
type Constructor<T> = new (...args: any[]) => T;

const createFactory = () => {
    const instances: IFactory[] = [];
    const listeners: Array<() => void> = [];

    const runInit = <T extends IFactory>(instance: T): T => {
        if (instance && typeof instance.onInit === 'function') {
            instance.onInit();
        }

        return instance;
    };

    const create = <T>(Ctor: Constructor<T>, ...args: any[]): T => {
        const instance = new Ctor(...args);
        instances.push(instance as unknown as IFactory);

        return instance;
    };

    const createAndInit = <T extends IFactory>(Ctor: Constructor<T>, ...args: any[]): T => {
        return runInit(create(Ctor, ...args) as T);
    };

    const register = <T extends IFactory>(instance: T): T => {
        if (instance) {
            instances.push(instance);
        }

        return instance;
    };

    const createMany = <T>(selector: string, Ctor: Constructor<T>, ...args: any[]): T[] => {
        return Array.from(document.querySelectorAll(selector)).map((element) => {
            return create(Ctor, element, ...args);
        });
    };

    const createManyAndInit = <T extends IFactory>(selector: string, Ctor: Constructor<T>, ...args: any[]): T[] => {
        return Array.from(document.querySelectorAll(selector)).map((element) => {
            return createAndInit(Ctor, element, ...args);
        });
    };

    const listen = (
        target: EventTarget | null | undefined,
        eventName: string,
        handler: EventListenerOrEventListenerObject,
        options?: boolean | AddEventListenerOptions
    ): (() => void) => {
        if (!target || typeof target.addEventListener !== 'function') {
            return () => {};
        }

        target.addEventListener(eventName, handler, options);

        const unsubscribe = () => target.removeEventListener(eventName, handler, options);
        listeners.push(unsubscribe);

        return unsubscribe;
    };

    const destroy = (): void => {
        listeners.forEach((unsubscribe) => unsubscribe());
        listeners.length = 0;

        instances.forEach((instance) => {
            if (instance && typeof instance.destroy === 'function') {
                instance.destroy();
            } else if (instance && typeof instance.dispose === 'function') {
                instance.dispose();
            }
        });

        instances.length = 0;
    };

    return {
        create,
        createAndInit,
        register,
        createMany,
        createManyAndInit,
        listen,
        destroy
    };
};

export default createFactory;
