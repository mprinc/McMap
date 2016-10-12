(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

var APP_SRC_STR = 'APP_SRC_STR';
var APP_DEST_STR = 'APP_DEST_STR';

var puzzles = {
  name: 'editors',
  COMPASS: {
    PATHS: {
      '.': {
        destDir: '.',
        cssDir: 'css'
      }
    }
  },

  puzzlesBuild: {
    mdParsingMarked: {
      path: [APP_SRC_STR, '..'],
      css: false,

      injectJs: 'node_modules/marked/lib/marked.js'
    },
    mdParsingToMarkdown: {
      path: [APP_SRC_STR, '..'],
      css: false,

      injectJs: 'node_modules/to-markdown/dist/to-markdown.js'
    },
    textAngular: {
      path: '.',
      css: true,

      injectJs: [
        'js/textAngular/textAngular-rangy.min.js',
        'js/textAngular/textAngular-sanitize.min.js',
        'js/textAngular/textAngular.min.js'
      ],

      injectCss: [
        'css/default.css',
        'css/textAngular/textAngular.css'
      ]
    },
    mediumEditor: {
      path: [APP_SRC_STR, '..'],
      css: true,

      injectJs: [
        'node_modules/medium-editor/dist/js/medium-editor.js',
        'node_modules/medium-editor-markdown/dist/me-markdown.standalone.js',
        'bower_components/angular-medium-editor/dist/angular-medium-editor.js'
      ],

      injectCss: [
        'node_modules/medium-editor/dist/css/medium-editor.css',
        'node_modules/medium-editor/dist/css/themes/default.css'
      ]
    },
    simpleMDE: {
      path: [APP_SRC_STR, '..'],
      css: true,

      injectJs: [
        'bower_components/simplemde/dist/simplemde.min.js',
        'bower_components/simplemde-angular/dist/simplemde-angular.js'
      ],

      injectCss: [
        'bower_components/simplemde/dist/simplemde.min.css'
      ]
    }
  },

  puzzles: {
    // parsink MD into HTML with marked
    // https://github.com/chjj/marked
    mdParsingMarked: {
      active: true,
      services: { // list of services that are available in this puzzle
      },
      plugins: { // list of plugins that are available in this puzzle
      }
    },
    // parsink HTML into MD with marked
    // https://github.com/domchristie/to-markdown
    mdParsingToMarkdown: {
      active: true,
      services: { // list of services that are available in this puzzle
      },
      plugins: { // list of plugins that are available in this puzzle
      }
    },
    textAngular: {
      active: true,
      services: { // list of services that are available in this puzzle
        // we use it just to inject module as a dependency in app.js
        textAngularService: { // service name
          isTS: false, // is written in TS
          isNG2: false, // is written as NG2
          isAvailableInNG1: true, // should it be available in NG1 world?
          isGlobal: false, // should we add it at the top level as addProvider in app2
          module: 'textAngular' // NG1 module the service is inserted in
          // path: 'cf.puzzles.ibis.service' // unique id/path that is addressing the service
        }
      },
      plugins: { // list of plugins that are available in this puzzle
      }
    },
    mediumEditor: {
      active: false,
      services: { // list of services that are available in this puzzle
        // we use it just to inject module as a dependency in app.js
        mediumEditorService: { // service name
          isTS: false, // is written in TS
          isNG2: false, // is written as NG2
          isAvailableInNG1: true, // should it be available in NG1 world?
          isGlobal: false, // should we add it at the top level as addProvider in app2
          module: 'angular-medium-editor' // NG1 module the service is inserted in
          // path: 'cf.puzzles.ibis.service' // unique id/path that is addressing the service
        }
      },
      plugins: { // list of plugins that are available in this puzzle
      }
    },
    simpleMDE: {
      active: true,
      services: { // list of services that are available in this puzzle
        // we use it just to inject module as a dependency in app.js
        simpleMdeService: { // service name
          isTS: false, // is written in TS
          isNG2: false, // is written as NG2
          isAvailableInNG1: true, // should it be available in NG1 world?
          isGlobal: false, // should we add it at the top level as addProvider in app2
          module: 'simplemde' // NG1 module the service is inserted in
          // path: 'cf.puzzles.ibis.service' // unique id/path that is addressing the service
        }
      },
      plugins: { // list of plugins that are available in this puzzle
      }
    }
  }
}

if(typeof window !== 'undefined'){
	if(typeof window.Config === 'undefined') window.Config = {};
  if(typeof window.Config.Plugins === 'undefined') window.Config.Plugins = {};
  if(typeof window.Config.Plugins.external === 'undefined') window.Config.Plugins.external = {};
	window.Config.Plugins.external[puzzles.name] = puzzles;
}

if(typeof angular !== 'undefined'){
	angular.module('Config')
		.constant("Plugins", puzzles);
}

if(typeof global !== 'undefined'){
	if(typeof global.Config === 'undefined') global.Config = {};
	global.Config.Plugins = puzzles;
}

// node.js world
if(typeof module !== 'undefined'){
	module.exports = puzzles;
}

}()); // end of 'use strict';
