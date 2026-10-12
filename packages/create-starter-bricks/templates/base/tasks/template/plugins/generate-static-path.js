import path from 'node:path';
import { Transform } from 'node:stream';
import userConfig from '../../../user.config.js';

const generateStaticPath = ({ prefix = userConfig.templateLocals.pathPrefix } = {}) => {
    return new Transform({
        objectMode: true,
        transform(file, encoding, callback) {
            if (file.isNull() || typeof prefix !== 'string' || prefix.length === 0) {
                callback(null, file);
                return;
            }

            if (file.isStream()) {
                callback(new Error('generate-static-path requires buffered file contents.'));
                return;
            }

            try {
                const relativePath = file.relative.replace(/\\/g, '/');
                const directory = path.posix.dirname(relativePath);
                const depth = directory === '.'
                    ? 0
                    : directory.split('/').filter(Boolean).length;
                const replacement = '../'.repeat(depth);
                const content = file.contents.toString('utf8');

                file.contents = Buffer.from(content.split(prefix).join(replacement), 'utf8');
                callback(null, file);
            } catch (error) {
                callback(error);
            }
        }
    });
};

export default generateStaticPath;
