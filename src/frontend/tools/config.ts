import {readFileSync} from 'fs';
import {argv} from 'yargs';
import {normalize, join} from 'path';
import * as chalk from 'chalk';

var PluginsConfig = require('../app/js/config/config.plugins');

console.log("Plugins.gardening: ", PluginsConfig.plugins.gardening);
// --------------
// Configuration.

const ENVIRONMENTS = {
    DEVELOPMENT: 'dev',
    PRODUCTION: 'prod'
};


export const SUB_PROJECT_NAME = argv['sub-project'] || PluginsConfig.project.name;

export const SUB_PROJECT = PluginsConfig.project.subProjects[SUB_PROJECT_NAME];

console.log('__dirname: ', __dirname);
// console.log("SUB_PROJECT: ", SUB_PROJECT);

export const PORT = argv['port'] || PluginsConfig.project.port || 8000;
export const PROJECT_ROOT = normalize(join(__dirname, '..'));
export const ENV = getEnvironment();
export const DEBUG = argv['debug'] || false;
export const DOCS_PORT = argv['docs-port'] || 4003;
export const COVERAGE_PORT = argv['coverage-port'] || 4004;
export const APP_BASE = argv['base'] || '/';

export const ENABLE_HOT_LOADING = !!argv['hot-loader'];
export const HOT_LOADER_PORT = 5578;

export const BOOTSTRAP_MODULE = ENABLE_HOT_LOADING ?
    SUB_PROJECT.BOOTSTRAP_MODULE_HOT_LOADER : SUB_PROJECT.BOOTSTRAP_MODULE;

export const APP_TITLE = SUB_PROJECT.APP_TITLE;

export const APP_SRC = SUB_PROJECT.APP_SRC;
export const APP_SRC_FROM_HERE = join('..', APP_SRC);
export const ASSETS_SRC = `${APP_SRC}/assets`;

export const TOOLS_DIR = 'tools';
export const DOCS_DEST = 'docs';
export const DIST_DIR = 'dist';
export const DEV_DEST = `${DIST_DIR}/dev`;
export const PROD_DEST = `${DIST_DIR}/prod`;
export const TMP_DIR_BASE = ENV === 'dev' ? `${DIST_DIR}/dev` : `${DIST_DIR}/tmp`;
// this is necessary to help Atom to work with ` character
export const TMP_DIR = ENV === 'dev' ? `${DIST_DIR}/dev` : `${DIST_DIR}/tmp/app`;
// this is necessary to help Atom to work with ` character
export const APP_DEST = `${DIST_DIR}/${ENV}`;
export const APP_DEST_FROM_HERE = join('..', APP_DEST);
export const CSS_DEST = `${APP_DEST}/css`;
export const FONTS_DEST = `${APP_DEST}/fonts`;
export const JS_DEST = `${APP_DEST}/js`;
export const APP_ROOT = ENV === 'dev' ? `${APP_BASE}${APP_DEST}/` : `${APP_BASE}`;
// this is necessary to help Atom to work with ` character
export const DEV_PUZZLES_SRC = SUB_PROJECT.DEV_PUZZLES_SRC;
export const DEV_PUZZLES_DEST = `${DIST_DIR}/${ENV}/${SUB_PROJECT.DEV_PUZZLES}`;
export const VERSION = appVersion();

export const CSS_PROD_BUNDLE = 'all.css';
export const JS_PROD_SHIMS_BUNDLE = 'shims_bundle.js';
export const JS_PROD_APP_BUNDLE = 'app_bundle.js';

export const VERSION_NPM = '2.14.2';
export const VERSION_NODE = '4.0.0';

console.log('APP_SRC: %s, APP_SRC_FROM_HERE: ', APP_SRC, APP_SRC_FROM_HERE);
console.log('APP_DEST: %s, APP_DEST_FROM_HERE: ', APP_DEST, APP_DEST_FROM_HERE);

export const COMPASS_CONFIG = SUB_PROJECT.COMPILATION.COMPASS;
console.log("SUB_PROJECT: ", SUB_PROJECT);

export var BUILD_SEQUENCE: [
  'clean.dev', // cleans prod (folder, ...)
  'build.compass', // compiles COMPASS files -> APP_DEST
  'build.assets.dev',   // copies asset files (not *.ts) from APP_SRC -> APP_DEST
                        // (and dependencies assets -> d.dest)
  'tslint', // ts linting
  'build.js.dev', // compiles ts files, replace templates and adds sourcemaps -> APP_DEST
  'build.index.dev' // inject all dependencies under coresponding placeholders
];

// states used to support smart building process
export var WATCH_BUILD_STATE:any = {
  printCommands: true, // print commands on any action
  autoBuild: false, // build after any watch trigger
  autoReload: true, // reload browser after any build
  notifyOnReload: true, // audio notify on reloading the browser
  everyBuildIsFull: false // should every triggered/requested build be full ?
};

// set of watch rules that will set particular steps of building process in response
export var WATCH_BUILD_RULES:any = {
};

// COMPASS/SASS rule
WATCH_BUILD_RULES[join(APP_SRC, '**/*.scss')] = {
  steps: {
    'clean.dev': false,
    'build.compass': true,
    'build.assets.dev': true,
    'tslint': false,
    'build.js.dev': false,
    'build.index.dev': true,
  }
};

// JS rule
WATCH_BUILD_RULES[join(APP_SRC, '**/*.js')] = {
  steps: {
    'clean.dev': false,
    'build.compass': false,
    'build.assets.dev': true,
    'tslint': false,
    'build.js.dev': false,
    'build.index.dev': true,
  }
};

// HTML rule
WATCH_BUILD_RULES[join(APP_SRC, '**/*.html')] = {
  steps: {
    'clean.dev': false,
    'build.compass': false,
    'build.assets.dev': true,
    'tslint': false,
    'build.js.dev': false,
    'build.index.dev': true,
  }
};

// TS rule
WATCH_BUILD_RULES[join(APP_SRC, '**/*.ts')] = {
  steps: {
    'clean.dev': false,
    'build.compass': false,
    'build.assets.dev': false,
    'tslint': true,
    'build.js.dev': true,
    'build.index.dev': false,
  }
};

// DEV_PUZZLES_SRC related
// COMPASS/SASS rule
WATCH_BUILD_RULES[join(DEV_PUZZLES_SRC, '**/*.scss')] = {
  steps: {
    'clean.dev': false,
    'build.compass': true,
    'build.assets.dev': true,
    'tslint': false,
    'build.js.dev': false,
    'build.index.dev': true,
  }
};

// JS rule
WATCH_BUILD_RULES[join(DEV_PUZZLES_SRC, '**/*.js')] = {
  steps: {
    'clean.dev': false,
    'build.compass': false,
    'build.assets.dev': true,
    'tslint': false,
    'build.js.dev': false,
    'build.index.dev': true,
  }
};

// HTML rule
WATCH_BUILD_RULES[join(DEV_PUZZLES_SRC, '**/*.html')] = {
  steps: {
    'clean.dev': false,
    'build.compass': false,
    'build.assets.dev': true,
    'tslint': false,
    'build.js.dev': false,
    'build.index.dev': true,
  }
};

// TS rule
WATCH_BUILD_RULES[join(DEV_PUZZLES_SRC, '**/*.ts')] = {
  steps: {
    'clean.dev': false,
    'build.compass': false,
    'build.assets.dev': false,
    'tslint': true,
    'build.js.dev': true,
    'build.index.dev': false,
  }
};

export var WATCH_BUILD_CHANGED_FILES = {};

// the set of building tasks that are set to be built on the next build
export var WATCH_CHANGED:any = {
  'clean.dev': false,
  'build.compass': false,
  'build.assets.dev': false,
  'tslint': false,
  'build.js.dev': false,
  'build.index.dev': false
};

/**
 * Replaces string version(s) of APP paths with real path values and returns string path
 * @param  {string[]|string} pathArray array of pa
 * @return {string} substituted path
 */
function replaceStrPaths(pathArray:string[]|string, parentPath?:string):string{
    if(typeof pathArray === 'string') pathArray = [<string>pathArray];

    var path = "";
    for(var pI in <string[]>pathArray){
      var pathPart = pathArray[pI];
      switch(pathPart){
          case 'APP_SRC_STR':
              pathPart = APP_SRC;
              break;
          case 'APP_DEST_STR':
              pathPart = APP_DEST;
              break;
          case '.':
              pathPart = parentPath ? parentPath : pathPart;
              break;
      }
      path += (path.length > 0) ? "/"+pathPart : pathPart;
    }
    return path;
}

// fixing/patching project variables
var inlineNg1 = SUB_PROJECT.COMPILATION.INLINE_NG1.SRC;
for(var i in inlineNg1){
    if(Array.isArray(inlineNg1[i])){
        console.log("inlineNg1.before: ", inlineNg1[i]);
        inlineNg1[i] = replaceStrPaths(inlineNg1[i]);
        console.log("inlineNg1.after: ", inlineNg1[i]);
    }
}

export const NG2LINT_RULES = customRules();

interface IDependency {
    src: string;
    inject?: string | boolean;
    asset?: boolean; // if set to true it will be copied to final destination
    dest?: string;
    noNorm?: boolean; // if true, dependency will not get normalize with normalizeDependencies()
}

// http://stackoverflow.com/questions/12787781/type-definition-in-object-literal-in-typescript
interface IDependencyStructure {
    APP_ASSETS: IDependency[];
    NPM_DEPENDENCIES: IDependency[];
    DEV_NPM_DEPENDENCIES: IDependency[];
    PROD_NPM_DEPENDENCIES: IDependency[];
};

// Declare local files that needs to be injected
export const SUB_PROJECTS_FILE:IDependencyStructure = {
    APP_ASSETS: [
        // (NG2-) MATERIAL
        { src: 'ng2-material/font/MaterialIcons-Regular.*', asset: true, dest: CSS_DEST }
    ],
    NPM_DEPENDENCIES: [
        // LIBS
        { src: join(APP_SRC, 'js/lib/debug.js'), inject: 'libs', noNorm: true },
        { src: join(APP_SRC, '../bower_components/debugpp/index.js'), inject: 'libs', noNorm: true },
        { src: join(APP_SRC, '../bower_components/halo/index.js'), inject: 'libs', noNorm: true },

        // KNALLEDGE APP
        { src: join(APP_SRC, 'js/config/config.js'), inject: true, noNorm: true },
        { src: join(APP_SRC, 'js/config/config.env.js'), inject: true, noNorm: true },
        { src: join(APP_SRC, 'js/config/config.plugins.js'), inject: true, noNorm: true },

        // KNALLEDGE CORE
        { src: join(APP_SRC, 'js/knalledge/index.js'), inject: true, noNorm: true },
        { src: join(APP_SRC, 'js/knalledge/kNode.js'), inject: true, noNorm: true },
        { src: join(APP_SRC, 'js/knalledge/kEdge.js'), inject: true, noNorm: true },
        { src: join(APP_SRC, 'js/knalledge/kMap.js'), inject: true, noNorm: true },
        { src: join(APP_SRC, 'js/knalledge/WhoAmI.js'), inject: true, noNorm: true },
        { src: join(APP_SRC, 'js/knalledge/HowAmI.js'), inject: true, noNorm: true },
        { src: join(APP_SRC, 'js/knalledge/WhatAmI.js'), inject: true, noNorm: true },
        { src: join(APP_SRC, 'js/knalledge/vkNode.js'), inject: true, noNorm: true },
        { src: join(APP_SRC, 'js/knalledge/vkEdge.js'), inject: true, noNorm: true },
        { src: join(APP_SRC, 'js/knalledge/state.js'), inject: true, noNorm: true },
        { src: join(APP_SRC, 'js/knalledge/mapStructure.js'), inject: true, noNorm: true },

        // COMPONENTS
        { src: join(APP_SRC, 'components/puzzles.js'), inject: true, noNorm: true },


        { src: join(APP_SRC, 'components/knalledgeMap/js/services.js'), inject: true, noNorm: true },

        // PLUGINS: TODO: We want to avoid hardoced registering plugins here!
        // TODO: should we add all dependencies to the all components
        // that are not statically imported
        // Example: components/knalledgeMap/main.js imports
        // components/topPanel/topPanel.js only if the config.plugins.js says so


        // ng1 registration and bootstrap
        // { src: join(TMP_DIR, 'components/knalledgeMap/knalledgeMapPolicyService.js'), inject: true, noNorm: true},
        // { src: join(TMP_DIR, 'components/knalledgeMap/knalledgeMapViewService.js'), inject: true, noNorm: true},

        // CSS
        // LIBS
        { src: join(APP_SRC, 'css/libs/bootstrap/bootstrap.css'), inject: true, dest: CSS_DEST, noNorm: true },
        // bootstrap 4
        { src: 'bootstrap/dist/css/bootstrap.css', inject: true, dest: CSS_DEST },

        // KNALLEDGE CORE
        { src: join(APP_SRC, 'css/libs/wizard/ngWizard.css'), inject: true, dest: CSS_DEST, noNorm: true },

        { src: join(APP_SRC, 'css/default.css'), inject: true, dest: CSS_DEST, noNorm: true },
        { src: join(APP_SRC, '../bower_components/halo/css/default.css'), inject: true, dest: CSS_DEST, noNorm: true },

        // KNALLEDGE PLUGINS, TODO: we want to avoid hardoced registering plugins here

        // (NG2-) MATERIAL
        // @angular/material theme
        { src: '@angular/material/core/theming/prebuilt/purple-green.css', inject: true, dest: CSS_DEST },
        { src: 'ng2-material/ng2-material.css', inject: true, dest: CSS_DEST },
        { src: 'ng2-material/font/font.css', inject: true, dest: CSS_DEST }
    ],
    DEV_NPM_DEPENDENCIES: [
    ],
    PROD_NPM_DEPENDENCIES: [
        // ng1 templates (build.js.prod:inlineNg1Templates())
        { src: join(TMP_DIR, 'js/ng1Templates.js'), inject: true, noNorm: true },
        { src: join(TMP_DIR, '..', DEV_PUZZLES_SRC, 'js/ng1Templates.js'), inject: true, noNorm: true }
    ]
};

var npmDependencies = SUB_PROJECTS_FILE.NPM_DEPENDENCIES;
var puzzlesBuild = PluginsConfig.plugins.puzzlesBuild;
var puzzlesConfig = PluginsConfig.plugins.puzzles;

// Example

/**
 * Analyzes puzzleBuild and extracts and injects JavaScript build dependencies in dependencies
 * @param  {IDependency[]} dependencies dependencies in which puzzle dependencies will be added
 * @param  {any}           puzzleBuild  config object describing build aspects of the puzzle
 */
function injectJsDependencyFactory(dependencies:IDependency[], puzzleBuild:any, parentPath?:string){
    // Example
    // { src: join('components/gardening/js/services.js'), inject: true, noNorm: true },

    var jsDpendencyTemplate = { src: null,
        inject: true, noNorm: true
    };

    var path = replaceStrPaths(puzzleBuild.path, parentPath);
    path = normalize(path);

    function injectJsDependency(injectJs:string){
        var dPath = injectJs[0] === '.' ? parentPath : path;
        // console.log("injectJs: ", injectJs, "dPath: ", dPath, "parentPath: ", parentPath, "path: ", path);
        var dependency:any = {};
        Object.assign(dependency, jsDpendencyTemplate);
        dependency.src = (dPath) ?
          dPath + "/" + injectJs : injectJs;
        dependency.src = normalize(dependency.src);
        console.log("[injectJsDependencyFactory] dependency=", dependency);
        dependencies.push(dependency);
    }
    return injectJsDependency;
}

/**
 * Analyzes puzzleBuild and extracts and injects CSS build dependencies in dependencies
 * @param  {IDependency[]} dependencies dependencies in which puzzle dependencies will be added
 * @param  {any}           puzzleBuild  config object describing build aspects of the puzzle
 */
function injectCssDependencyFactory(dependencies:IDependency[], puzzleBuild:any, parentPath?:string){
    // Example
    // { src: join(APP_SRC, 'components/gardening/css/default.css'), inject: true, dest: CSS_DEST, noNorm: true },

    var cssDpendencyTemplate = { src: null, dest: CSS_DEST,
        inject: true, noNorm: true
    };

    var path = replaceStrPaths(puzzleBuild.path, parentPath);
    path = normalize(path);

    function injectCssDependency(injectCss:string){
      var dPath = injectCss[0] === '.' ? parentPath : path;
        var dependency:any = {};
        Object.assign(dependency, cssDpendencyTemplate);
        dependency.src = (dPath) ?
          dPath + "/" + injectCss : injectCss;
        dependency.src = normalize(dependency.src);
        console.log("[injectCssDependencyFactory] dependency=", dependency);
        dependencies.push(dependency);
    }
    return injectCssDependency;
}

/**
 * Analyzes puzzleBuild and extracts and injects all build dependencies in dependencies
 * @param  {IDependency[]} dependencies dependencies in which puzzle dependencies will be added
 * @param  {any}           puzzleBuild  config object describing build aspects of the puzzle
 */
function injectPuzzle(dependencies:IDependency[], puzzleBuild:any, parentPath?:string){

    let injectJsDependency = injectJsDependencyFactory(dependencies, puzzleBuild, parentPath);

    if(Array.isArray(puzzleBuild.injectJs)){
        for(let i in puzzleBuild.injectJs){
            let injectJs = puzzleBuild.injectJs[i];
            injectJsDependency(injectJs);
        }
    }else if(puzzleBuild.injectJs){
        let injectJs = puzzleBuild.injectJs;
        injectJsDependency(injectJs);
    }

    let injectCssDependency = injectCssDependencyFactory(dependencies, puzzleBuild, parentPath);

    if(Array.isArray(puzzleBuild.injectCss)){
        for(let i in puzzleBuild.injectCss){
            let injectCss = puzzleBuild.injectCss[i];
            injectCssDependency(injectCss);
        }
    }else if(puzzleBuild.injectCss){
        let injectCss = puzzleBuild.injectCss;
        injectCssDependency(injectCss);
    }
}


/**
 * Analyzes if there are additional sub puzzles/build-folders in the puzzleBuild
 * and calls injectPuzzle on appropriate builds
 * @param  {IDependency[]} dependencies dependencies in which puzzle dependencies will be added
 * @param  {any}           puzzleBuild  config object describing build aspects of the puzzle
 */
function injectPuzzleWithPossibleSubPuzzles(dependencies:IDependency[], puzzleBuild:any, parentPath?:string){
  if('path' in puzzleBuild){
      injectPuzzle(dependencies, puzzleBuild, parentPath);
  }else{
      for(var subPuzzleName in puzzleBuild){
          var subPuzzleBuild = puzzleBuild[subPuzzleName];
          console.log("subPuzzleBuild: ", subPuzzleBuild);
          if('path' in subPuzzleBuild){
              injectPuzzle(dependencies, subPuzzleBuild, parentPath);
          }
      }
  }
}

/*
 * Iterates through all puzzles inside the puzzlesBuild and injects them in dependencies
 */
for(var puzzleName in puzzlesBuild){
    var puzzleBuild = puzzlesBuild[puzzleName];
    console.log("puzzleBuild: ", puzzleBuild);

    // if not configured or set as unavailable do not inject it
    if(!(puzzleName in puzzlesConfig) || !puzzlesConfig[puzzleName].active) continue;
    injectPuzzleWithPossibleSubPuzzles(npmDependencies, puzzleBuild);
}

var puzzles = PluginsConfig.plugins.puzzles;


/*
 * INJECTING EXTERNAL PUZZLES
 */

function injectExternalPuzzle(parentPuzzleName:string, puzzle:any){
  console.log("[injectExternalPuzzle] Injecting external puzzle: ", parentPuzzleName);
  var puzzlePath = puzzle.path;
  var puzzlesContainerConfig = require(join(PROJECT_ROOT, puzzlePath, 'config.js'));

  // injecting dependencies
  var puzzlesBuild = puzzlesContainerConfig.puzzlesBuild;
  var puzzlesConfig = puzzlesContainerConfig.puzzles;
  console.log("external puzzlesBuild: ", puzzlesBuild);

  // inject 'config.js' if not already injected
  // we need this to be accessable during the runtime
  for(var puzzleName in puzzlesBuild){
    var puzzleBuild = puzzlesBuild[puzzleName];

    // if not configured or set as unavailable do not inject it
    if(!(puzzleName in puzzlesConfig) || !puzzlesConfig[puzzleName].active) continue;

    if(typeof puzzleBuild.injectJs === 'string') puzzleBuild.injectJs = [puzzleBuild.injectJs];
    if(puzzleBuild.injectJs.indexOf('config.js') < 0){
      puzzleBuild.injectJs.push('./config.js');
    }

    // if not configured or set as unavailable do not inject it
    injectPuzzleWithPossibleSubPuzzles(npmDependencies, puzzleBuild, puzzlePath);
  }


  // injecting compass building
  var compassPaths = COMPASS_CONFIG.PATHS;
  var compassPathsPuzzle = puzzlesContainerConfig.COMPASS.PATHS;
  for(var cppPath in compassPathsPuzzle){
    var compassPathPuzzle = compassPathsPuzzle[cppPath];
    compassPathPuzzle.isPathFull = true;
    compassPaths[puzzlePath] = compassPathPuzzle;
  }
}

/*
 * Iterates through all puzzles inside the puzzles config and if they are external
 * injects them
 * 1. EXTERNAL PUZZLES - BUILD PHASE
 */
for(var puzzleName in puzzles){
    var puzzle = puzzles[puzzleName];
    if('path' in puzzle && !!puzzle.active){
      injectExternalPuzzle(puzzleName, puzzle);
    }
}

// add app.js after all other external puzzles-containers' configs are provided
// so app.js is capable of accessing external puzzles-containers' configs
SUB_PROJECTS_FILE.NPM_DEPENDENCIES.push(
  { src: join(APP_SRC, 'js/app.js'), inject: true, noNorm: true }
);


if (ENABLE_HOT_LOADING) {
    console.log(chalk.bgRed.white.bold('The hot loader is temporary disabled.'));
    process.exit(0);
}

// Declare NPM dependencies (Note that globs should not be injected).
const NPM_DEPENDENCIES: IDependency[] = [
    { src: 'core-js/client/shim.min.js', inject: 'shims' },
    { src: 'systemjs/dist/system-polyfills.src.js', inject: 'shims' },
    { src: 'reflect-metadata/Reflect.js', inject: 'shims' },
    { src: 'es6-shim/es6-shim.js', inject: 'shims' },
    { src: 'systemjs/dist/system.src.js', inject: 'shims' },

    { src: join(APP_SRC, 'js/lib/jquery/jquery.js'), inject: 'libs', noNorm: true },
    { src: join(APP_SRC, 'js/lib/bootstrap/bootstrap.js'), inject: 'libs', noNorm: true },

    { src: 'angular/angular.js', inject: 'libs' },
    { src: 'angular-route/angular-route.js', inject: 'libs' },
    { src: 'angular-sanitize/angular-sanitize.js', inject: 'libs' },
    { src: 'angular-resource/angular-resource.js', inject: 'libs' },
    { src: 'angular-animate/angular-animate.js', inject: 'libs' },
    { src: 'ngstorage/ngStorage.js', inject: 'libs' },

    { src: join(APP_SRC, 'js/lib/d3/d3.js'), inject: 'libs', noNorm: true },
    { src: join(APP_SRC, 'js/lib/interact-1.2.4.js'), inject: 'libs', noNorm: true },
    { src: join(APP_SRC, 'js/lib/keyboard.js'), inject: 'libs', noNorm: true },
    { src: join(APP_SRC, 'js/lib/deepAssign.js'), inject: 'libs', noNorm: true },
    { src: join(APP_SRC, 'js/lib/tween/tween.js'), inject: 'libs', noNorm: true },
    { src: join(APP_SRC, 'js/lib/socket.io/socket.io.js'), inject: 'libs', noNorm: true },
    { src: join(APP_SRC, 'js/lib/ui-bootstrap/ui-bootstrap-tpls-0.12.1.js'), inject: 'libs', noNorm: true },
    { src: join(APP_SRC, 'js/lib/wizard/ngWizard.js'), inject: 'libs', noNorm: true },
    // { src: join(APP_SRC, 'js/lib/ng2-file-upload/ng2-file-upload.js'), inject: 'libs', noNorm: true },
    { src: join(APP_SRC, 'js/lib/socket.io/angular.socket.io.js'), inject: 'libs', noNorm: true },

    { src: 'hammerjs/hammer.js', inject: 'libs' },
    { src: 'rxjs/bundles/Rx.js', inject: 'libs' },
];

const DEV_NPM_DEPENDENCIES: IDependency[] = [
    // { src: 'angular2/es6/dev/src/testing/shims_for_IE.js', inject: 'shims' },
    { src: 'zone.js/dist/zone.js', inject: 'shims' },
];

const PROD_NPM_DEPENDENCIES: IDependency[] = [
    { src: 'zone.js/dist/zone.js', inject: 'shims' },
    // { src: 'angular2/bundles/angular2.min.js', inject: 'libs' },
    // { src: '@angular/common/index.js', inject: 'libs' },
    // { src: '@angular/compiler/index.js', inject: 'libs' },
    // { src: '@angular/core/index.js', inject: 'libs' },
    // { src: '@angular/http/index.js', inject: 'libs' },
    // { src: '@angular/platform-browser/index.js', inject: 'libs' },
    // { src: '@angular/platform-browser-dynamic/index.js', inject: 'libs' },
    // { src: '@angular/router/index.js', inject: 'libs' },
    // { src: '@angular/router-deprecated/index.js', inject: 'libs' },
    // { src: '@angular/upgrade/index.js', inject: 'libs' }
];

console.log("NPM_DEPENDENCIES: ", NPM_DEPENDENCIES);
console.log("DEV_NPM_DEPENDENCIES: ", DEV_NPM_DEPENDENCIES);
console.log("SUB_PROJECTS_FILE.NPM_DEPENDENCIES: ", SUB_PROJECTS_FILE.NPM_DEPENDENCIES);
console.log("SUB_PROJECTS_FILE.DEV_NPM_DEPENDENCIES: ", SUB_PROJECTS_FILE.DEV_NPM_DEPENDENCIES);
console.log("SUB_PROJECTS_FILE.APP_ASSETS: ", SUB_PROJECTS_FILE.APP_ASSETS);

export const DEV_DEPENDENCIES = normalizeDependencies(NPM_DEPENDENCIES.
    concat(DEV_NPM_DEPENDENCIES, SUB_PROJECTS_FILE.NPM_DEPENDENCIES,
    SUB_PROJECTS_FILE.DEV_NPM_DEPENDENCIES, SUB_PROJECTS_FILE.APP_ASSETS)
);

export const PROD_DEPENDENCIES = normalizeDependencies(NPM_DEPENDENCIES.
    concat(PROD_NPM_DEPENDENCIES, SUB_PROJECTS_FILE.NPM_DEPENDENCIES,
    SUB_PROJECTS_FILE.PROD_NPM_DEPENDENCIES, SUB_PROJECTS_FILE.APP_ASSETS)
);

export const DEPENDENCIES = ENV === 'dev' ? DEV_DEPENDENCIES : PROD_DEPENDENCIES;
console.log(chalk.bgWhite.blue.bold(' DEPENDENCIES: '), chalk.blue(JSON.stringify(DEPENDENCIES)));

// ----------------
// SystemsJS Configuration.

var config = {
    "defaultJSExtensions": true,
    "defaultExtension": "js",
    map: {
      app: 'app',
      '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
      '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
      '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
      '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',
      '@angular/http': 'npm:@angular/http/bundles/http.umd.js',
      // '@angular/material': 'npm:@angular/material/bundles/material.umd.js',
      '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
      '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
      '@angular/router': 'npm:@angular/router/bundles/router.umd.js',
      '@angular/upgrade': 'npm:@angular/upgrade/bundles/upgrade.umd.js',

      'rxjs': 'npm:rxjs',
      "ng2-material": "ng2-material/index.js",
      "components/knalledgeMap/main": "components/knalledgeMap/main.js",
      "@ng-bootstrap/ng-bootstrap": "npm:@ng-bootstrap/ng-bootstrap/bundles/ng-bootstrap.js"
    },

    // TODO: should we add all dependencies to the all components
    // that are not statically imported
    // Example: components/knalledgeMap/main.js imports
    // components/topPanel/topPanel.js only if the config.plugins.js says so
    // it seems it doesn't make builder to inject it in the app_bundle.js

    // https://github.com/systemjs/systemjs/blob/master/docs/module-formats.md
    // https://github.com/systemjs/systemjs/blob/master/docs/config-api.md#meta
    meta: {
        "components/knalledgeMap/main": {
            format: "global",
            deps: ["components/topPanel/topPanel"]
        },
        "components/topPanel/topPanel": {
            build: true
        }
    },
    packageConfigPaths: ['./node_modules/*/package.json',
        './node_modules/@angular/*/package.json',
        './node_modules/@angular2-material/*/package.json',
        './node_modules/@ng-bootstrap/ng-bootstrap/package.json'
    ],
    packages: {
        "symbol-observable": {
          main: "index.js"
        },
        app: {
          main: './js/app2.js',
          defaultExtension: 'js'
        },
        rxjs: {
          defaultExtension: 'js'
        },
        '@angular/material': {
          format: 'cjs',
          main: 'material.umd.js'
        },
    },
    paths: {
        [BOOTSTRAP_MODULE]: `${APP_BASE}${BOOTSTRAP_MODULE}`,
        // 'rxjs/*': `${APP_BASE}rxjs/*`,
        '*': `./node_modules/*`,
        'dist/*': `./dist/*`,

        "bootstrap": "/bootstrap",
        'npm:': 'node_modules/',
    }
};

// put the names of any of your Material components here
var materialPkgs = [
    'core',
    'checkbox',
    'sidenav',
    'checkbox',
    'input',
    'progress-bar',
    'progress-circle',
    'radio',
    'tabs',
    'toolbar'
];

// for(var pI in materialPkgs){
//     var pkg = materialPkgs[pI];
//     config.packages['@angular2-material/'+pkg] = {main: pkg+'.js'};
// }

// put the names of any of your Angular components here
var angularPkgs = [
    'common', 'compiler', 'core',
    'forms', 'http', 'platform-browser',
    'platform-browser-dynamic', 'router',
    'router-deprecated', 'upgrade'
];
// for(var pI in angularPkgs){
//     var pkg = angularPkgs[pI];
//     config.packages['@angular/'+pkg] = {main: 'index.js', defaultExtension: 'js'};
// }
const SYSTEM_CONFIG_DEV = config;

// TODO: Fix
// const SYSTEM_CONFIG_PROD = {
//   defaultJSExtensions: true,
//   bundles: {
//     'bundles/app': ['bootstrap']
//   }
// };

// export const SYSTEM_CONFIG = ENV === 'dev' ? SYSTEM_CONFIG_DEV : SYSTEM_CONFIG_PROD;

export const SYSTEM_CONFIG = SYSTEM_CONFIG_DEV;

console.log("[config.ts] SYSTEM_CONFIG: ", JSON.stringify(SYSTEM_CONFIG));

// https://github.com/systemjs/systemjs/blob/master/docs/config-api.md
// https://github.com/ModuleLoader/es6-module-loader/blob/master/docs/loader-config.md#paths-implementation
config.paths[`${TMP_DIR}/*`] = `${TMP_DIR}/*`;
// config.paths['*'] = 'node_modules/*';

export const SYSTEM_BUILDER_CONFIG = config;

console.log("[config.ts] SYSTEM_BUILDER_CONFIG: ", JSON.stringify(SYSTEM_BUILDER_CONFIG));

// export const SYSTEM_BUILDER_CONFIG = {
//     defaultJSExtensions: true,
//     // https://github.com/ModuleLoader/es6-module-loader/blob/master/docs/loader-config.md#paths-implementation
//     paths: {
//         [`${TMP_DIR}/*`]: `${TMP_DIR}/*`,
//         '*': 'node_modules/*'
//     }
// };

// --------------
// Private.

// finds the full path for a dependency, like paths for packages from node_modules
// so we do not need to refer to them with node_modules prefixes
// NOTE: this is not true for non-js files
function normalizeDependencies(deps: IDependency[]) {
    deps
        .filter((d: IDependency) => !/\*/.test(d.src)) // Skip globs
        .forEach((d: IDependency) => { if (d.noNorm !== true) d.src = require.resolve(d.src); });
    return deps;
}

function appVersion(): number | string {
    var pkg = JSON.parse(readFileSync('package.json').toString());
    return pkg.version;
}

function customRules(): string[] {
    var lintConf = JSON.parse(readFileSync('tslint.json').toString());
    return lintConf.rulesDirectory;
}

function getEnvironment() {
    let base: string[] = argv['_'];
    let env = ENVIRONMENTS.DEVELOPMENT;
    let prodKeyword = !!base.filter(o => o.indexOf(ENVIRONMENTS.PRODUCTION) >= 0).pop();
    if (base && prodKeyword || argv['env'] === ENVIRONMENTS.PRODUCTION
    || process.env.NODE_ENV === 'prod'
    || process.env.NODE_ENV === 'production') {
        env = ENVIRONMENTS.PRODUCTION;
    }
    console.log("[getEnvironment] ENV: ", env);

    return env;
}
