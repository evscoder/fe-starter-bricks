import uiModules from '../ui/index.js';
import { isPlatformClasses } from '../utils/is-platform.js';
import { IFactory } from '../interfaces/factory.js';

export class BaseApp {
    private readonly createModules: () => IFactory;

    private _ui: IFactory | null = null;

    private _modules: IFactory | null = null;

    constructor(createModules: () => IFactory) {
        this.createModules = createModules;
    }

    onStart = (): void => {
        this.init();
        this.afterLoad();
    };

    init(): void {
        isPlatformClasses();
        this._ui = uiModules();
        this._modules = this.createModules();
    }

    destroy(): void {
        if (this._ui && typeof this._ui.destroy === 'function') {
            this._ui.destroy();
        }

        if (this._modules && typeof this._modules.destroy === 'function') {
            this._modules.destroy();
        }

        this._ui = null;
        this._modules = null;
    }

    afterLoad(): void {
        if (document.readyState === 'complete') {
            this.markLoaded();
        } else {
            window.addEventListener('load', this.markLoaded, { once: true });
        }
    }

    markLoaded = (): void => {
        document.body?.classList.add('load');
    };
}

export function bootstrapApp<T extends BaseApp>(
    AppClass: new (createModules: () => IFactory) => T,
    createModules: () => IFactory
): T {
    const app = new AppClass(createModules);

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', app.onStart, { once: true });
    } else {
        app.onStart();
    }

    return app;
}
