// import 'normalize-css/normalize.css';
// import 'animate.css';

import isPlatform from './fn/isPlatforms.js';
import UIComponents from './ui/index.js';
import ModulesComponent from './modules/index.js';

class App {
    constructor() {
        this.init();
    }

    onLoaded = () => {
        document.body.classList.add('load');
    };

    onReady = () => {
        isPlatform();
        UIComponents();
        ModulesComponent();
    };

    init() {
        document.addEventListener('DOMContentLoaded', this.onReady);
        window.addEventListener('load', this.onLoaded);
    }
}

const app = new App();
