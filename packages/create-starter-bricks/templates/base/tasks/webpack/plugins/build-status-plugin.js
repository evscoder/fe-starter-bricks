export default class BuildStatusPlugin {
    constructor(options = {}) {
        const config = typeof options === 'string'
            ? { name: options }
            : options;

        this.name = config.name || 'Build';
        this.showDuration = config.showDuration !== false;
        this.durationUnit = config.durationUnit || 'auto';
        this.showWarnings = Boolean(config.showWarnings);
        this.silent = Boolean(config.silent);
        this.successPrefix = config.successPrefix || '✔';
        this.errorPrefix = config.errorPrefix || '✖';
    }

    formatDuration(duration) {
        if (this.durationUnit === 's') {
            return `${(duration / 1000).toFixed(2)} s`;
        }

        if (
            this.durationUnit === 'auto'
            && duration >= 1000
        ) {
            return `${(duration / 1000).toFixed(2)} s`;
        }

        return `${duration} ms`;
    }

    apply(compiler) {
        compiler.hooks.done.tap(
            'BuildStatusPlugin',
            stats => {
                if (this.silent) {
                    return;
                }

                if (stats.hasErrors()) {
                    console.error(
                        `${this.errorPrefix} ${this.name} build failed`
                    );

                    return;
                }

                let message = `${this.successPrefix} ${this.name} built`;

                if (this.showDuration) {
                    const duration = stats.endTime - stats.startTime;

                    message += ` in ${this.formatDuration(duration)}`;
                }

                if (
                    this.showWarnings
                    && stats.hasWarnings()
                ) {
                    const { warnings } = stats.toJson({
                        all: false,
                        warnings: true
                    });
                    const count = warnings?.length || 0;

                    if (count > 0) {
                        message += ` (${count} warning${count === 1 ? '' : 's'})`;
                    }
                }

                console.log(message);
            }
        );
    }
}
