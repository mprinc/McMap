import {join} from 'path';
import {APP_SRC} from '../config';

var vfs = require('vinyl-fs');

// watches changes in the whole project (APP_SRC) of any file in it and
// on change it runs all tests for the project
export = function watchTest(gulp, plugins) {
  return function () {
    plugins.watch(join(APP_SRC, '**/*.ts'), () => vfs.start('build.test'));
  };
};
