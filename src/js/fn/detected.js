const isTouchDevices = ('ontouchstart' in window) || (window.DocumentTouch && document instanceof window.DocumentTouch);
const isMobilePlatform = /iPhone|iPad|Android|blackberry|windows phone|IEMobile|Opera Mini/i.test(navigator.userAgent);
const isPlatformIOS = /iPhone|iPad/i.test(navigator.userAgent);
const detectedPlatforms = () => {
    if (isTouchDevices) {
        document.documentElement.classList.add('is-touch');
    }

    if (isMobilePlatform) {
        document.documentElement.classList.add('is-mobile-platform');
    }

    if (isPlatformIOS) {
        document.documentElement.classList.add('ios');
    }
};

export default detectedPlatforms;
