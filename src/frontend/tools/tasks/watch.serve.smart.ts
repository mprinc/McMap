import * as runSequence from 'run-sequence';
import {join} from 'path';
import {APP_SRC, WATCH_BUILD_RULES, WATCH_CHANGED} from '../config';
import {notifyLiveReload} from '../utils';
import {buildProject} from '../utils/build.dev.smart';

// watches changes in the whole project (APP_SRC) of any file in it and
// on change it builds dev version of the project and
// notifies server to push changes to the browser
export = function watchServe(gulp, plugins) {
  return function () {
    function watchOnRule(ruleName, rule){
      console.log("[watch.serve.smart] watching on: ", ruleName);
      plugins.watch(ruleName, function(e) {
        console.log("[watch.serve.smart] rule `%s` changed", ruleName);
        var steps = rule.steps;
        for(var stepName in steps){
          if(steps[stepName]){
            WATCH_CHANGED[stepName] = true;
            console.log("[watch.serve.smart] \tneed to build: ", stepName);
          }
        }
        buildProject(undefined, e);
      });
    }
    for(let wN in WATCH_BUILD_RULES){
      watchOnRule(wN, WATCH_BUILD_RULES[wN]);
    }
  };
};
