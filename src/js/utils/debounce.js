const debounce = (cb, delay) => {
    let timeoutHandler = null;

    return (...args) => {
        clearTimeout(timeoutHandler);
        timeoutHandler = setTimeout(() => cb(...args), delay);
    };
};

export default debounce;
