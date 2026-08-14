export default class BuildStatusPlugin {
    constructor(name) {
        this.name = name;
    }

    apply(compiler) {
        compiler.hooks.done.tap(
            'BuildStatusPlugin',
            stats => {
                if (stats.hasErrors()) {
                    console.error(
                        `✖ ${this.name} build failed`
                    );

                    return;
                }

                const duration = stats.endTime - stats.startTime;

                console.log(
                    `✔ ${this.name} built in ${duration} ms`
                );
            }
        );
    }
}
