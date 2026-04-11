import path from 'path';
import { fileURLToPath } from 'url';
const dirname = path.dirname(fileURLToPath(import.meta.url));
import gulp from 'gulp';
import fs from 'fs';
import * as config from '../config.js';
import { $, browser, notifyErr } from '../helper.js';
import emitty from './helpers/emitty-config.js';
import generateStaticPath from './helpers/generate-static-path.js';
import nunjucksResolveRelativeIncludes from './helpers/nunjucks-relative-paths-includes.js';
import RelativeFileSystemLoader from './helpers/nunjucks-relative-system-loader.js';
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

const getConfig = async () => {
    const configPath = path.join(dirname, '../../src/tmplConfig.js') + '?t=' + Date.now();
    const configModule = await import(configPath);
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

const template = () => {
    const templateCompile = () => {
        if (isProduction || global.disableEmitty) {
            return task();
        }

        return new Promise((resolve, reject) => {
            emitty.scan(global.emittyPugChangedFile)
                .then(() => task(resolve, reject))
                .catch(event => console.log(event));
        });
    };

    const emailsCompile = (cb) => {
        if (emailsBuild) {
            return src(emailPath.filesSrc)
                .pipe($.plumber(notifyErr()))
                .pipe($.mjml())
                .pipe($.htmlBeautify(prettify))
                .pipe(dest(emailPath.dist));
        }

        return cb();
    };

    const task = async (resolve = () => {}, reject = () => {}) => {
        const tmpConfigData = await getConfig();

        return src(templatePath.src)
            .pipe($.plumber(notifyErr()))
            .pipe($.if(!isProduction && !global.disableEmitty, emitty.filter(global.emittyPugChangedFile)))
            .pipe($.if(!isProduction, $.debug()))
            .pipe($.data(() => ({
                ...templateLocals,
                ...dataParser(),
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
    };

    return {
        templateCompile,
        emailsCompile
    };
};

export default template;
