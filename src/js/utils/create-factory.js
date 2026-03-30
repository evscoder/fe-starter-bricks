const createFactory = () => {
    const instances = [];
    const listeners = [];

    const runInit = (instance) => {
        if (instance && typeof instance.onInit === 'function') {
            instance.onInit();
        }

        return instance;
    };

    const create = (Ctor, ...args) => {
        const instance = new Ctor(...args);
        instances.push(instance);

        return instance;
    };

    const createAndInit = (Ctor, ...args) => {
        return runInit(create(Ctor, ...args));
    };

    const register = (instance) => {
        if (instance) {
            instances.push(instance);
        }

        return instance;
    };

    const createMany = (selector, Ctor, ...args) => {
        return Array.from(document.querySelectorAll(selector)).map((element) => {
            return create(Ctor, element, ...args);
        });
    };

    const createManyAndInit = (selector, Ctor, ...args) => {
        return Array.from(document.querySelectorAll(selector)).map((element) => {
            return createAndInit(Ctor, element, ...args);
        });
    };

    const listen = (target, eventName, handler, options) => {
        if (!target || typeof target.addEventListener !== 'function') {
            return () => {};
        }

        target.addEventListener(eventName, handler, options);

        const unsubscribe = () => target.removeEventListener(eventName, handler, options);
        listeners.push(unsubscribe);

        return unsubscribe;
    };

    const destroy = () => {
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
