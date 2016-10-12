import * as runSequence from 'run-sequence';
import {WATCH_BUILD_STATE, WATCH_CHANGED, WATCH_BUILD_CHANGED_FILES} from '../config';
import {notifyLiveReload} from '../utils';

// connects to stdin and sets it to listen for separate key presses
// it respond to few key commands and 'passes through' others
function setListeningForKeyCommands(){
  var stdin = process.stdin;
  stdin['setRawMode'](true);
  stdin.resume();
  stdin.setEncoding('utf8');
  stdin.on('data', function(key){
    // ctrl-a
    if(key === '\u0001'){
      WATCH_BUILD_STATE.autoBuild = !WATCH_BUILD_STATE.autoBuild;
      console.log("WATCH_BUILD_STATE.autoBuild: ", WATCH_BUILD_STATE.autoBuild);
    }

    // ctrl-b
    if(key === '\u0002'){
      buildProject(undefined, undefined, true);
    }

    // ctrl-c
    if(key === '\u0003'){
      console.log("[build.dev.smart] quiting watch/build");
      process.exit();
    }

    // ctrl-e
    if(key === '\u0005'){
      WATCH_BUILD_STATE.everyBuildIsFull = !WATCH_BUILD_STATE.everyBuildIsFull;
      console.log("WATCH_BUILD_STATE.everyBuildIsFull: ", WATCH_BUILD_STATE.everyBuildIsFull);
    }

    // ctrl-f
    if(key === '\u0006'){
      console.log("[build.dev.smart] full build");
      setAllWatches();
      buildProject(undefined, undefined, true);
    }

    // ctrl-i
    if(key === '\u0009'){
      WATCH_CHANGED['build.assets.dev'] = true;
      WATCH_CHANGED['build.index.dev'] = true;
      printWaitingToBuildTasks();
      // buildProject(undefined, undefined, true);
    }

    // ctrl-l
    if(key === '\u000C'){
      let filesList = filesToBeReloadedToList();
      console.log("[build.dev.smart] browser files to be reloaded: ", filesList);
    }

    // ctrl-m
    if(key === '\u000D'){
      printCommands();
    }

    // ctrl-r
    if(key === '\u0012') reloadBrowser();

    // ctrl-t
    if(key === '\u0014') printWaitingToBuildTasks();

    process.stdout.write(key);
  });
}

setListeningForKeyCommands();

// print all pssible build/watch commands
export function printCommands(){
  console.log("Commands: ");
  console.log("  - CTRL+A: is automatic build (%s)", WATCH_BUILD_STATE.autoBuild);
  console.log("  - CTRL+B: build");
  console.log("  - CTRL+C: quit");
  console.log("  - CTRL+E: is every build full (%s)", WATCH_BUILD_STATE.everyBuildIsFull);
  console.log("  - CTRL+F: full build");
  console.log("  - CTRL+I: add tasks necessary to reinject files into index.html (build.assets.dev, build.index.dev)");
  console.log("  - CTRL+L: show list of files to be reload");
  console.log("  - CTRL+R: reload");
  console.log("  - CTRL+T: show the list of tasks waiting to be built");
  console.log("  - CTRL+M: show commands");
}

/*
* Files to be reloaded
* related functions
*/

// cleans all files from the to-be-reloaded set
function cleanFilesToBeReloaded(){
  for(var filePath in WATCH_BUILD_CHANGED_FILES){
    delete WATCH_BUILD_CHANGED_FILES[filePath];
  }
}

// adds files to the to-be-reloaded set
function addFilesToBeReloaded(files){
  for(var foI in files){
    var filesObj = files[foI];
    for(var fI in filesObj.history){
      var fileName = filesObj.history[fI];
      WATCH_BUILD_CHANGED_FILES[fileName] = filesObj;
    }
  }
}

// adds files to the to-be-reloaded set
function fileObjsToBeReloadedToList(): String[]{
  let fileObjs:String[] = [];
  for(var filePath in WATCH_BUILD_CHANGED_FILES){
    var fileObj = WATCH_BUILD_CHANGED_FILES[filePath];
    fileObjs.push(fileObj);
  }
  return fileObjs;
}

// adds files to the to-be-reloaded set
function filesToBeReloadedToList(): String[]{
  let filesList:String[] = [];
  for(var filePath in WATCH_BUILD_CHANGED_FILES){
    filesList.push(filePath);
  }
  return filesList;
}

// reloads browser with the list of files thas have to be reloaded
// (cummulativelly captured across previous watches)
function reloadBrowser(){
  let fileObjs = fileObjsToBeReloadedToList();
  let filesList = filesToBeReloadedToList();
  cleanFilesToBeReloaded();
  console.log("[build.dev.smart] reloading browser with files: ", filesList);
  notifyLiveReload(fileObjs);
}

/*
* watching tasks
* related functions
*/

// clean the next building-tasks watching set
function cleanWatches(){
  for(var taskName in WATCH_CHANGED){
    WATCH_CHANGED[taskName] = false;
  }
}

// clean the next building-tasks watching set
function setAllWatches(){
  for(var taskName in WATCH_CHANGED){
    WATCH_CHANGED[taskName] = true;
  }
}

// print all building tasks that are waiting to be built
function printWaitingToBuildTasks(){
  let taskSequence:(String|Function)[] = [];
  for(var taskName in WATCH_CHANGED){
    if(WATCH_CHANGED[taskName]){
      taskSequence.push(taskName);
    }
  }
  console.log("[build.dev.smart] tasks waiting to be built: ", taskSequence);
}

// builds projects (builds only the tasks that are set for building)
export function buildProject(done?, filesToBeReloaded?, isManualBuild?) {
  if(!Array.isArray(filesToBeReloaded) && typeof filesToBeReloaded !== 'undefined'){
    filesToBeReloaded = [filesToBeReloaded];
    addFilesToBeReloaded(filesToBeReloaded);
  }

  if(!(isManualBuild || WATCH_BUILD_STATE.autoBuild)){
    printWaitingToBuildTasks();
    console.log("[build.dev.smart] No building is required. Either enable it by CTRL+A or initiate it manualy with CTRL+B");
    printCommands();
    if(typeof done === 'function') done();
    return;
  }

  if(WATCH_BUILD_STATE.everyBuildIsFull) setAllWatches();

  console.log("[build.dev.smart] preparing for building");
  let taskSequence:(String|Function)[] = [];
  for(var taskName in WATCH_CHANGED){
    if(WATCH_CHANGED[taskName]){
      console.log("[build.dev.smart] \tadded to build: ", taskName);
      taskSequence.push(taskName);
    }
  }

  cleanWatches();

  if(taskSequence.length === 0){
    console.log("[build.dev.smart] no building tasks");
    if(typeof done === 'function') done();
  }else{
    console.log("[build.dev.smart] building tasks: ", taskSequence);
    taskSequence.push(function(err){
      if(WATCH_BUILD_STATE.autoReload) reloadBrowser();
      if(WATCH_BUILD_STATE.printCommands) printCommands();
      if(WATCH_BUILD_STATE.notifyOnReload) {
        // use
        // say -v Whisper "Browser is reloading"
      }
      if(typeof done === 'function') done(err);
    });
    return runSequence.apply(this, taskSequence);
  }
}
