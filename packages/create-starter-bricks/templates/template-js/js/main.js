import { BaseApp, bootstrapApp } from './core/core.js';
import modulesComponent from './modules/index.js';

class MainComponent extends BaseApp {}

export const app = bootstrapApp(MainComponent, modulesComponent);
