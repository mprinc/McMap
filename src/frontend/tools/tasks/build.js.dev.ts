import {join} from 'path';
import * as merge from 'merge-stream';
import {APP_SRC, APP_DEST, DEV_PUZZLES_SRC, DEV_PUZZLES_DEST} from '../config';
import {templateLocals, tsProjectFn} from '../utils';

var vfs = require('vinyl-fs');

// compiles all ts files (except tests/template ones) and type definitions,
// replace templates in them and adds sourcemaps and copies into APP_DEST
export = function buildJSDev(gulp, plugins) {
  return function() {
    // https://www.npmjs.com/package/merge-stream
    return merge(buildProject(), buildDevPuzzles());

    function buildDevPuzzles() {
      // creates a TypeScript project from the 'tsconfig.json' file
      let tsProject = tsProjectFn(plugins);

      // src files are all ts files (except tests/template ones) and type definitions
      let src = [
        'typings/index.d.ts',
        'tools/manual_typings/**/*.d.ts',
        join(DEV_PUZZLES_SRC, '**/*.ts'),
        '!' + join(APP_SRC, '**/*.spec.ts'),
        '!' + join(APP_SRC, '**/*.e2e.ts')
      ];
      let result = vfs.src(src)
        .pipe(plugins.plumber())
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.typescript(tsProject));

      return result.js
        .pipe(plugins.sourcemaps.write())
        .pipe(plugins.template(templateLocals()))
        .pipe(vfs.dest(DEV_PUZZLES_DEST));
    }

    function buildProject() {
      // creates a TypeScript project from the 'tsconfig.json' file
      let tsProject = tsProjectFn(plugins);

      // src files are all ts files (except tests/template ones) and type definitions
      let src = [
        'typings/index.d.ts',
        'tools/manual_typings/**/*.d.ts',
        join(APP_SRC, '**/*.ts'),
        '!' + join(APP_SRC, '**/*.spec.ts'),
        '!' + join(APP_SRC, '**/*.e2e.ts')
      ];
      let result = vfs.src(src)
        .pipe(plugins.plumber())
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.typescript(tsProject));

      return result.js
        .pipe(plugins.sourcemaps.write())
        .pipe(plugins.template(templateLocals()))
        .pipe(vfs.dest(APP_DEST));
    }
  };
};
