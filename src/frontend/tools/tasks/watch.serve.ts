import * as runSequence from 'run-sequence';
import {join} from 'path';
import {APP_SRC} from '../config';
import {notifyLiveReload} from '../utils';

// watches changes in the whole project (APP_SRC) of any file in it and
// on change it builds dev version of the project and
// notifies server to push changes to the browser
export = function watchServe(gulp, plugins) {
  return function () {
    plugins.watch(join(APP_SRC, '**'), e =>
      runSequence('build.dev', () => notifyLiveReload(e))
    );
  };
};
