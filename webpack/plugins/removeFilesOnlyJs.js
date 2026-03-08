import webpack from 'webpack';

export default class RemoveFilesOnlyJsPlugin {
    constructor(options = {}) {
        this.test = options.test ?? /^styles\.js(\.map)?$/;
    }

    apply(compiler) {
        compiler.hooks.thisCompilation.tap('RemoveFilesOnlyJsPlugin', (compilation) => {
            const { Compilation } = webpack;

            compilation.hooks.processAssets.tap(
                {
                    name: 'RemoveFilesOnlyJsPlugin',
                    stage: Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE
                },
                (assets) => {
                    Object.keys(assets).forEach((name) => {
                        if (this.test.test(name)) {
                            // eslint-disable-next-line no-param-reassign
                            delete compilation.assets[name];
                        }
                    });
                }
            );
        });
    }
}
