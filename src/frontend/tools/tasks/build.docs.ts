import {join} from 'path';
import {APP_SRC, APP_TITLE, DOCS_DEST} from '../config';
var vfs = require('vinyl-fs');

export = function buildDocs(gulp, plugins, option) {
  return function() {

    let src = [
      'typings/main.d.ts',
      join(APP_SRC, '**/*.ts'),
      '!' + join(APP_SRC, '**/*.spec.ts'),
      '!' + join(APP_SRC, '**/*.e2e.ts')
    ];

    return vfs.src(src)
      .pipe(plugins.typedoc({
        // TypeScript options (see typescript docs)
        module: 'commonjs',
        target: 'es5',
        includeDeclarations: true,
        // Output options (see typedoc docs)
        out: DOCS_DEST,
        json: join(DOCS_DEST , 'data/docs.json' ),
        name: APP_TITLE,
        ignoreCompilerErrors: false,
        experimentalDecorators: true,
        version: true
      }));
    };
};
