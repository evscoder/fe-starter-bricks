import { BaseApp, bootstrapApp } from './core/core';
import modulesComponent from './modules/index';

class MainComponent extends BaseApp {}

export const app = bootstrapApp(MainComponent, modulesComponent);
