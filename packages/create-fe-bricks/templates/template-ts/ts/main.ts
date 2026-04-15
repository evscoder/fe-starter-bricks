import { isPlatformClasses } from './utils/is-platform';
import uiComponent from './ui';
import modulesComponent from './modules';

class App {
    onStart = (): void => {
        this.init();
        this.afterLoad();
    };

    private init(): void {
        isPlatformClasses();
        uiComponent();
        modulesComponent();
    }

    private afterLoad(): void {
        if (document.readyState === 'complete') {
            this.markLoaded();
        } else {
            window.addEventListener('load', this.markLoaded, { once: true });
        }
    }

    private markLoaded = (): void => {
        document.body?.classList.add('load');
    };
}

const app = new App();

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', app.onStart, { once: true });
} else {
    app.onStart();
}
