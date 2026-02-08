// import 'normalize-css/normalize.css';
// import 'animate.css';

import detectedPlatforms from './fn/detected.js';
import Header from '../components/layout/header/header.js';

class App {
    constructor() {
        this.init();
    }

    onLoaded = () => {
        document.body.classList.add('load');
    };

    onReady = () => {
        detectedPlatforms();

        const header = new Header();
    };

    init() {
        document.addEventListener('DOMContentLoaded', this.onReady);
        window.addEventListener('load', this.onLoaded);
    }
}

const app = new App();
