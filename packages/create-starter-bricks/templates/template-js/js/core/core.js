import uiModules from '../ui/index.js';
import { isPlatformClasses } from "../utils/is-platform.js";

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
        this._ui = uiModules();
        this._modules = this.createModules();
    }

    destroy() {
        if (this._ui && typeof this._ui.destroy === 'function') {
            this._ui.destroy();
        }

        if (this._modules && typeof this._modules.destroy === 'function') {
            this._modules.destroy();
        }

        this._ui = null;
        this._modules = null;
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
