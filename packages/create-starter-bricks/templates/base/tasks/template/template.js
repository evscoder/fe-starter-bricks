import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
const dirname = path.dirname(fileURLToPath(import.meta.url));
import gulp from 'gulp';
import fs from 'fs';
import * as config from '../config.js';
import { $, browser, notifyErr } from '../helper.js';
import { TemplateDependencies } from './plugins/template-dependencies.js';
import generateStaticPath from './plugins/generate-static-path.js';
import nunjucksResolveRelativeIncludes from './plugins/nunjucks-relative-paths-includes.js';
import RelativeFileSystemLoader from './plugins/nunjucks-relative-system-loader.js';
import dataModule from './data.js';
import userConfig from '../../user.config.js';
import { emailPath, isProduction, templatePath } from '../config.js';
const { src, dest } = gulp;
const {
    emailsBuild,
    templateEngine,
    templateLocals,
    prettify,
    htmlMinify,
    sourceFolder
} = userConfig;
const { dataParser } = dataModule;
const dependencies = new TemplateDependencies({
    root: sourceFolder,
    engine: templateEngine
});

const getConfig = async () => {
    const configPath = pathToFileURL(
        path.resolve(dirname, '../..', sourceFolder, 'tmplConfig.js')
    );

    configPath.searchParams.set('t', Date.now().toString());
    const configModule = await import(configPath.href);
    return configModule.default(templateLocals);
};

const createDependencies = () => {
    const patterns = [];

    if (isProduction) {
        templateLocals.version = '?ver' + Math.floor(Date.now() / 1000);
    }

    if (templateLocals.symbolsInject) {
        patterns.push({
            match: '%symbols%',
            replacement: (() => fs.readFileSync(`${config.imagesPath.dist}/symbols.svg`, 'utf8'))
        });
    } else {
        patterns.push({
            match: '%symbols%',
            replacement: ''
        });
    }

    return {
        patterns
    };
};

const { patterns } = createDependencies();

const createTemplateTasks = () => {
    const tasks = {
        templateCompile: () => {
            const changedFiles = global.templateChangedFiles || [];
            const forceFull = isProduction || global.disableTemplateIncremental;

            return new Promise((resolve, reject) => {
                const scan = isProduction
                    ? Promise.resolve(null)
                    : dependencies.scan(changedFiles);

                scan
                    .then(affected => tasks.task(resolve, reject, forceFull ? null : affected))
                    .catch(reject);
            });
        },

        templateRecompileAll: () => {
            return new Promise((resolve, reject) => {
                tasks.task(resolve, reject).catch(reject);
            });
        },

        emailsCompile: (cb) => {
            if (emailsBuild) {
                return src(emailPath.filesSrc)
                    .pipe($.plumber(notifyErr()))
                    .pipe($.mjml())
                    .pipe($.htmlBeautify(prettify))
                    .pipe(dest(emailPath.dist));
            }

            return cb();
        },

        task: async (resolve = () => {}, reject = () => {}, affected = null) => {
            const tmpConfigData = await getConfig();
            const templateData = dataParser();

            return src(templatePath.src)
                .pipe($.plumber(notifyErr()))
                .pipe(dependencies.filter(affected))
                .pipe($.if(!isProduction, $.debug()))
                .pipe($.data(() => ({
                    ...templateLocals,
                    ...templateData,
                    ...tmpConfigData,
                    alias: (p) => p.replace(/^@/, sourceFolder + '/')
                })))
                .pipe($.if(
                    templateEngine === 'nunjucks',
                    nunjucksResolveRelativeIncludes({ root: sourceFolder })
                ))
                .pipe(
                    $.if(
                        templateEngine === 'pug',
                        $.pug({
                            pretty: !isProduction
                        }).on('error', () => browser.notify('<strong>FAIL</strong> Pug')),

                        $.if(
                            templateEngine === 'twig',
                            $.twig({
                                base: sourceFolder
                            }).on('error', () => browser.notify('<strong>FAIL</strong> Twig')),

                            $.nunjucksRender({
                                loaders: [new RelativeFileSystemLoader(sourceFolder)]
                            }).on('error', () => browser.notify('<strong>FAIL</strong> Nunjucks'))
                        )
                    )
                )
                .pipe($.replaceTask({
                    patterns: patterns,
                    usePrefix: false
                }))
                .pipe($.if(templateEngine === 'twig', $.rename((p) => {
                    const pathObj = p;

                    pathObj.basename = p.basename.replace(/\.html$/i, '');
                    pathObj.extname = '.html';
                })))
                .pipe(generateStaticPath())
                .pipe($.htmlBeautify(prettify))
                .pipe($.if(htmlMinify && isProduction, $.htmlmin({
                    removeComments: true,
                    collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeAttributeQuotes: true,
                    removeRedundantAttributes: false,
                    removeEmptyAttributes: true,
                    removeScriptTypeAttributes: true,
                    removeStyleLinkTypeAttributes: true,
                    removeOptionalTags: true
                })))
                .pipe(dest(templatePath.dist))
                .on('end', resolve)
                .on('error', reject);
        }
    };

    return tasks;
};

const templateTasks = createTemplateTasks();

export default templateTasks;
