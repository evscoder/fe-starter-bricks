import path from 'node:path';
import SVGSpritemapPlugin from 'svg-spritemap-webpack-plugin';
import { imagesPath } from '../config.js';
import currentColorPlugin from './plugins/current-color-plugin.js';
import WebpackBar from "webpackbar";

export const svgSpriteConfig = {
    entry: {},
    output: {
        path: path.resolve(
            import.meta.dirname,
            `../../${imagesPath.dist}`
        )
    },
    performance: {
        hints: false
    },
    stats: {
        all: false,
        errors: true,
        warnings: true,
        errorsCount: true,
        timings: true,
        errorDetails: false
    },
    infrastructureLogging: {
        level: 'none'
    },
    plugins: [
        new WebpackBar({
            name: 'SVG sprite',
            color: '#1B75BB',
            fancy: true,
            basic: false
        }),
        new SVGSpritemapPlugin(
            path.resolve(
                import.meta.dirname,
                `../../${imagesPath.svgSpriteFolder}/**/*.svg`
            ),
            {
                output: {
                    filename: 'symbols.svg',

                    chunk: {
                        keep: false
                    },

                    svg: {
                        sizes: false
                    },

                    svgo: {
                        plugins: [
                            {
                                name: 'preset-default',
                                params: {
                                    overrides: {

                                        /*
                                         * Do not shorten IDs to a, b, c.
                                         * Otherwise clipPaths from different
                                         * icons can conflict in the sprite.
                                         */
                                        cleanupIds: false,

                                        /*
                                         * Do not remove <symbol> nodes without
                                         * internal ID references (icons without
                                         * clipPath/mask). SVGO v4 treats them
                                         * as "hidden" and drops them from the
                                         * sprite.
                                         */
                                        removeHiddenElems: false
                                    }
                                }
                            },
                            'removeDimensions',
                            currentColorPlugin
                        ]
                    }
                },

                sprite: {
                    prefix: 'icon-',
                    generate: {
                        symbol: true,
                        title: false,
                        dimensions: false,
                        use: false,
                        view: false
                    }
                }
            }
        )
    ]
};
