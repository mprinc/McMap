import {join} from 'path';
import {APP_SRC, APP_DEST} from '../config';
import {templateLocals, tsProjectFn} from '../utils';

// compiles all ts files (except tests/template ones) and type definitions,
// replace templates in them and adds sourcemaps and copies into APP_DEST
export = function buildJSDev(gulp, plugins) {
  return function () {
      // creates a TypeScript project from the 'tsconfig.json' file
    let tsProject = tsProjectFn(plugins);
    // src files are all ts files (except tests/template ones) and type definitions
    let src = [
      'typings/browser.d.ts',
      'tools/manual_typings/**/*.d.ts',
      join(APP_SRC, '**/*.ts'),
      '!' + join(APP_SRC, '**/*.spec.ts'),
      '!' + join(APP_SRC, '**/*.e2e.ts')
    ];
    let result = gulp.src(src)
      .pipe(plugins.plumber())
      .pipe(plugins.sourcemaps.init())
      .pipe(plugins.typescript(tsProject));

    return result.js
      .pipe(plugins.sourcemaps.write())
      .pipe(plugins.template(templateLocals()))
      .pipe(gulp.dest(APP_DEST));
  };
};
