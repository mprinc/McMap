import {join} from 'path';
import {APP_SRC} from '../config';

var vfs = require('vinyl-fs');

// watches changes in the whole project (APP_SRC) of any file in it and
// on change it builds dev version of the project
export = function watchDev(gulp, plugins) {
  return function () {
    plugins.watch(join(APP_SRC, '**/*'), () => vfs.start('build.dev'));
  };
};
