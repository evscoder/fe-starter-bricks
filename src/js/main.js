// import 'normalize-css/normalize.css';
// import 'animate.css';

import {
    isMobilePlatform,
    isPlatformIOS,
    isTouchDevices
} from './fn/detected.js';
import Header from '../components/layout/header/header.js';

class App {
    constructor() {
        this.setDetected();
        this.init();
    }

    setDetected() {
        if (isTouchDevices) {
            document.documentElement.classList.add('is-touch');
        }

        if (isMobilePlatform) {
            document.documentElement.classList.add('is-mobile-platform');
        }

        if (isPlatformIOS) {
            document.documentElement.classList.add('ios');
        }
    }

    onLoaded = () => {
        document.body.classList.add('load');
    };

    onReady = () => {
        new Header();
    };

    init() {
        document.addEventListener('DOMContentLoaded', this.onReady);
        window.addEventListener('load', this.onLoaded);
    }

    dispose() {

    }
}

const app = new App();
