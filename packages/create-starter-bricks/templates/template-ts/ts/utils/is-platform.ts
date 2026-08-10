export const isTouchDevices = (): boolean => {
    const win = window as Window & { DocumentTouch?: unknown };

    return ('ontouchstart' in window) || (typeof win.DocumentTouch !== 'undefined');
};

export const isMobile = () => {
    return /iPhone|iPad|Android|blackberry|windows phone|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export const isIOS = () => {
    return /iPad|iPhone|iPod/i.test(navigator.userAgent);
};

export const isPlatformClasses = () => {
    const root = document.documentElement;

    root.classList.toggle('is-touch', isTouchDevices());
    root.classList.toggle('is-mobile', isMobile());
    root.classList.toggle('ios', isIOS());
};
