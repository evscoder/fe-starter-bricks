import through2 from 'through2';
import path from 'path';
import Buffer from 'buffer';
import * as config from '../../config.js';

const bufferObj = Buffer.Buffer;
const { templateLocals } = config.argvMode;
const getStaticPrefix = pageDepth => `${pageDepth.join('')}`;

const parserObj = function (chunk, enc, done) {
    const chunkObj = chunk;

    // Get all directories array for current page from page directory
    const directoriesArray = path.parse(chunk.relative).dir.split(path.sep);

    // Generate static path as '../' as many times, as directories array length
    const pageDepth = directoriesArray.map(value => {
        return value ? '../' : '';
    });

    let newPageContent = chunk.contents.toString();

    newPageContent = newPageContent
        .split(templateLocals.pathPrefix)
        .join(getStaticPrefix(pageDepth));

    chunkObj.contents = bufferObj.from(newPageContent);
    this.push(chunkObj);

    return done();
};

const generateStaticPath = () => through2.obj(parserObj, done => done());

export default generateStaticPath;
