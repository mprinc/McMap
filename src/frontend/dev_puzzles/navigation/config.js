(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

var puzzles = {
  name: 'navigation',
  COMPASS: {
    PATHS: {
      '.': {
        destDir: '.',
        cssDir: 'css'
      }
    }
  },

  puzzlesBuild: {
    navigation: {
      path: '.',
      css: true,
      injectJs: '',
      injectCss: 'css/default.css'
    }
  },

  puzzles: {
    navigation: {
      active: true,
      services: { // list of services that are available in this puzzle
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
