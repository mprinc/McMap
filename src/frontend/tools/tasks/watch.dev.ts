import {join} from 'path';
import {APP_SRC} from '../config';

// watches changes in the whole project (APP_SRC) of any file in it and
// on change it builds dev version of the project
export = function watchDev(gulp, plugins) {
  return function () {
    plugins.watch(join(APP_SRC, '**/*'), () => gulp.start('build.dev'));
  };
};
