import gulp from 'gulp';
import * as config from '../config.js';
import { $ } from '../helper.js';
const { src, dest } = gulp;

const svgSprite = () => {
    return src(`${config.imagesPath.svgSrc}/**/*.svg`)
        .pipe($.debug({ title: 'svg sprite' }))
        .pipe($.svgSymbols(
            {
                templates: [
                    `gulp/images/helpers/svg-symbols-template.svg`
                ],
                transformData: (svg, defaultData) => {
                    return {
                        id: defaultData.id,
                        width: svg.width,
                        height: svg.height,
                        name: svg.name
                    };
                }
            }
        ))
        .pipe($.rename({ basename: 'symbols' }))
        .pipe(dest(config.imagesPath.dist));
};

export default svgSprite;
