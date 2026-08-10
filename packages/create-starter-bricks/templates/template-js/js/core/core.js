import uiModules from '../ui/index.js';
import { isPlatformClasses } from '../utils/is-platform.js';

export class BaseApp {
    constructor(createModules) {
        this.createModules = createModules;
    }

    onStart = () => {
        this.init();
        this.afterLoad();
    };

    init() {
        isPlatformClasses();
        this.ui = uiModules();
        this.modules = this.createModules();
    }

    destroy() {
        if (this.ui && typeof this.ui.destroy === 'function') {
            this.ui.destroy();
        }

        if (this.modules && typeof this.modules.destroy === 'function') {
            this.modules.destroy();
        }

        this.ui = null;
        this.modules = null;
    }

    afterLoad() {
        if (document.readyState === 'complete') {
            this.markLoaded();
        } else {
            window.addEventListener('load', this.markLoaded, { once: true });
        }
    }

    markLoaded = () => {
        document.body?.classList.add('load');
    };
}

export function bootstrapApp(AppClass, createModules) {
    const app = new AppClass(createModules);

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', app.onStart, { once: true });
    } else {
        app.onStart();
    }

    return app;
}
