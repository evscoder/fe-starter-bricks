import { createRequire } from 'module';
import gulp from 'gulp';
import fs from 'fs';
import * as config from '../config.js';
import { $, browser, notifyErr } from '../helper.js';
import generateStaticPath from './helpers/generate-static-path.js';
import Data from './data.js';
const { src, dest } = gulp;
const {
    EMAILS_BUILD,
    templatePreproc,
    templateLocals,
    prettify,
    htmlMinify
} = config.argvMode;
const { production } = config.argvMode.env;

const emittyConfig = (() => {
    if (templatePreproc === 'nunjucks') {
        return {
            extensions: ['.njk', '.html'],
            matcher: /{%\s*(?:include|import|extends|from)\s['"]([^'"]+)['"]\s.*?%}/,
            comments: {
                start: '{#',
                end: '#}'
            }
        };
    }

    return templatePreproc;
})();

const emitty = createRequire(import.meta.url)('emitty').setup(config.sourceFolder, emittyConfig);
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
    static htmlCompile() {
        if (!templateCache) {
            return Template.task();
        }

        return new Promise((resolve, reject) => {
            emitty.scan(global.emittyPugChangedFile)
                .then(Template.task(resolve, reject))
                .catch(event => console.log(event));
        });
    }

    static emailsCompile(cb) {
        if (EMAILS_BUILD) {
            return src(config.email.filesSrc)
                .pipe($.plumber(notifyErr()))
                .pipe($.mjml())
                .pipe($.htmlBeautify(prettify))
                .pipe(dest(config.email.dist));
        }

        return cb();
    }

    static task(resolve, reject) {
        return src(config.template.src)
            .pipe($.plumber(notifyErr()))
            .pipe($.if(templateCache === true, emitty.filter(global.emittyPugChangedFile)))
            .pipe($.if(templateCache === true, $.debug()))
            .pipe($.data(Data.parser()))
            .pipe($.if(templatePreproc === 'pug',
                $.pug({
                    pretty: true,
                    locals: templateLocals
                }).on('error', () => browser.notify('<strong>FAIL</strong> Pug')),
                $.nunjucksRender({
                    path: config.template.render,
                    data: templateLocals
                }).on('error', () => browser.notify('<strong>FAIL</strong> Nunjucks'))))
            .pipe($.replaceTask({
                patterns: patterns,
                usePrefix: false
            }))
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
    }
}
