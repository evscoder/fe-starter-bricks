const throttle = (cb, delay) => {
    let timeoutId = null;
    let lastArgs;
    let lastContext;

    return function (...args) {
        lastArgs = args;
        lastContext = this;

        if (!timeoutId) {
            timeoutId = setTimeout(() => {
                cb.apply(lastContext, lastArgs);
                timeoutId = null;
            }, delay);
        }
    };
};

export default throttle;
