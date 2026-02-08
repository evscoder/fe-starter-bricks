import gulp from 'gulp';
import fs from 'fs';
import * as config from '../config.js';
import { $, browser, notifyErr } from '../helper.js';
import Data from './data.js';
import emitty from './helpers/emitty-config.js';
import generateStaticPath from './helpers/generate-static-path.js';
import nunjucksResolveRelativeIncludes from './helpers/nunjucks-relative-paths-includes.js';
import RelativeFileSystemLoader from './helpers/nunjucks-relative-system-loader.js';

const { src, dest } = gulp;

const {
    EMAILS_BUILD,
    templatePreproc,
    templateLocals,
    prettify,
    htmlMinify
} = config.argvMode;
const { production } = config.argvMode.env;

const data = new Data();

const patterns = [];

let { templateCache } = config.argvMode;

if (production) {
    templateCache = false;
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

export default class Template {
    htmlCompile = () => {
        if (!templateCache) {
            return this.task();
        }

        const task = this.task;

        return new Promise((resolve, reject) => {
            emitty.scan(global.emittyPugChangedFile)
                .then(task(resolve, reject))
                .catch(event => console.log(event));
        });
    };

    emailsCompile = (cb) => {
        if (EMAILS_BUILD) {
            return src(config.email.filesSrc)
                .pipe($.plumber(notifyErr()))
                .pipe($.mjml())
                .pipe($.htmlBeautify(prettify))
                .pipe(dest(config.email.dist));
        }

        return cb();
    };

    task = (resolve, reject) => {
        return src(config.template.src)
            .pipe($.plumber(notifyErr()))
            .pipe($.if(templateCache === true, emitty.filter(global.emittyPugChangedFile)))
            .pipe($.if(templateCache === true, $.debug()))
            .pipe($.data(() => ({
                ...templateLocals,
                ...data.parser(),
                alias: (p) => p.replace(/^@/, config.sourceFolder + '/')
            })))
            .pipe($.if(
                templatePreproc === 'nunjucks',
                nunjucksResolveRelativeIncludes({ root: config.sourceFolder })
            ))
            .pipe(
                $.if(
                    templatePreproc === 'pug',
                    $.pug({
                        pretty: true
                    }).on('error', () => browser.notify('<strong>FAIL</strong> Pug')),

                    $.if(
                        templatePreproc === 'twig',
                        $.twig({
                            base: config.sourceFolder
                        }).on('error', () => browser.notify('<strong>FAIL</strong> Twig')),

                        $.nunjucksRender({
                            loaders: [new RelativeFileSystemLoader(config.sourceFolder)]
                        }).on('error', () => browser.notify('<strong>FAIL</strong> Nunjucks'))
                    )
                )
            )
            .pipe($.replaceTask({
                patterns: patterns,
                usePrefix: false
            }))
            .pipe($.if(templatePreproc === 'twig', $.rename((p) => {
                const path = p;

                path.basename = p.basename.replace(/\.html$/i, '');
                path.extname = '.html';
            })))
            .pipe(generateStaticPath())
            .pipe($.htmlBeautify(prettify))
            .pipe($.if(htmlMinify && !templateCache, $.htmlmin({
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
            .pipe(dest(config.template.dist))
            .on('end', templateCache ? resolve : () => {})
            .on('error', templateCache ? reject : () => {});
    };
}
