import uiModules from '../ui/index';
import { isPlatformClasses } from '../utils/is-platform';
import { IFactory } from '../interfaces/factory';

export class BaseApp {
    private readonly createModules: () => IFactory;

    private ui: IFactory | null = null;

    private modules: IFactory | null = null;

    constructor(createModules: () => IFactory) {
        this.createModules = createModules;
    }

    onStart = (): void => {
        this.init();
        this.afterLoad();
    };

    init(): void {
        isPlatformClasses();
        this.ui = uiModules();
        this.modules = this.createModules();
    }

    destroy(): void {
        if (this.ui && typeof this.ui.destroy === 'function') {
            this.ui.destroy();
        }

        if (this.modules && typeof this.modules.destroy === 'function') {
            this.modules.destroy();
        }

        this.ui = null;
        this.modules = null;
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
    modulesFactory: () => IFactory
): T {
    const app = new AppClass(modulesFactory);

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', app.onStart, { once: true });
    } else {
        app.onStart();
    }

    return app;
}
