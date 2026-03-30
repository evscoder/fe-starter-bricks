import path from 'path';
import { fileURLToPath } from 'url';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import WebpackBar from 'webpackbar';
import WebpackShellPluginNext from 'webpack-shell-plugin-next';
import { argvMode, webpackPath } from '../gulp/config.js';
const dirname = path.dirname(fileURLToPath(import.meta.url));
const { production } = argvMode.env;

export const envSettings = () => {
    const sourceMap = argvMode.sourcemaps ? true : !production;
    let devtool;

    if (argvMode.sourcemaps) {
        devtool = 'source-map';
    } else if (production) {
        devtool = false;
    } else {
        devtool = 'source-map';
    }

    return { sourceMap, devtool };
};

const { sourceMap, devtool } = envSettings();

const rules = [
    {
        test: /\.s[ac]ss$/i,
        use: [
            {
                loader: MiniCssExtractPlugin.loader
            },
            {
                loader: 'css-loader',
                options: {
                    sourceMap
                }
            },
            {
                loader: 'postcss-loader',
                options: {
                    sourceMap
                }
            },
            {
                loader: 'sass-loader',
                options: {
                    sourceMap,
                    sassOptions: {
                        quietDeps: true
                    }
                }
            }
        ]
    },
    {
        test: /\.css$/i,
        use: [
            {
                loader: MiniCssExtractPlugin.loader
            },
            {
                loader: 'css-loader',
                options: {
                    sourceMap
                }
            },
            {
                loader: 'postcss-loader',
                options: {
                    sourceMap
                }
            }
        ]
    }
];

if (argvMode.typeScript) {
    rules.push({
        test: /\.ts?$/,
        exclude: /node_modules/,
        use: 'ts-loader'
    });
} else {
    rules.push({
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
            {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
                }
            }
        ]
    });
}

const webpackConfig = {
    mode: production ? 'production' : 'development',
    devtool,
    entry: webpackPath.entry,
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
    module: {
        rules
    },
    plugins: [
        new WebpackShellPluginNext({
            onBuildStart: {
                scripts: production ? [] : ['clear'],
                blocking: true,
                parallel: false
            }
        }),
        new WebpackBar(),
        new MiniCssExtractPlugin({
            filename: '../css/[name].css'
        }),
        new ESLintPlugin()
    ],
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    chunks: 'initial',
                    test: /node_modules/,
                    name: 'vendor',
                    enforce: true
                }
            }
        },
        minimize: production,
        minimizer: production ? [
            '...',
            new CssMinimizerPlugin()
        ] : []
    },
    output: {
        path: path.resolve(dirname, webpackPath.output),
        publicPath: webpackPath.output,
        filename: '[name].js'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
        alias: {}
    }
};

export {
    webpackConfig
};
