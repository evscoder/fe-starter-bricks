import { isPlatformClasses } from './utils/is-platform.js';
import uiComponent from './ui/index.js';
import modulesComponent from './modules/index.js';
class App {
    onStart = () => {
        this.init();
        this.afterLoad();
    };

    markLoaded = () => {
        if (document.body) {
            document.body.classList.add('load');
        }
    };

    init() {
        isPlatformClasses();
        uiComponent();
        modulesComponent();
    }

    afterLoad() {
        if (document.readyState === 'complete') {
            this.markLoaded();
        } else {
            window.addEventListener('load', this.markLoaded, { once: true });
        }
    }
}

const app = new App();

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', app.onStart, { once: true });
} else {
    app.onStart();
}
