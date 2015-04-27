(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';
//this function is strict...

module.exports = function(grunt) {
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			// define the files to lint
			files: ['gruntfile.js' 
			        , 'app/js/**/*.js', '!app/js/lib/**/*.js'
			        , 'components/mcmMap/js/**/*.js', '!components/mcmMap/js/lib/**/*.js'
			        ],
			// ignores: ['app/js/lib/**/*.js'],
			// configure JSHint (documented at http://www.jshint.com/docs/)
			options: {
				laxcomma: true, // http://jshint.com/docs/options/#laxcomma
				newcap: false, // http://jshint.com/docs/options/#newcap
				// more options here if you want to override JSHint defaults
				latedef: "nofunc", // http://jshint.com/docs/options/#latedef
				shadow: "inner", // http://jshint.com/docs/options/#shadow
				undef: true, // http://jshint.com/docs/options/#undef
				unused: true, // http://jshint.com/docs/options/#unused
				funcscope: false, // http://jshint.com/docs/options/#funcscope
				globals: { // http://jshint.com/docs/options/#globals
					jQuery: true,
					$: true,
					angular: true,
					console: true,
					module: true,
					d3: true,
					interact: true,
					KeyboardJS: true,
					window: true,

					// application related global objects
					interaction: true,
					mcm: true,
					knalledge: true
				}
			}
		},
		karma: {
			unit: {
				configFile: 'karma.conf.js',
				autoWatch: true
			}
		},
		protractor: {
			options: {
				configFile: "node_modules/protractor/example/conf.js", // Default config file
				keepAlive: true, // If false, the grunt process stops when the test fails.
				noColor: false, // If true, protractor will not use colors in its output.
				args: {
					// Arguments passed to the command
				}
			},
			your_target: {   // Grunt requires at least one target to run so you can simply put 'all: {}' here too.
				options: {
					configFile: "e2e.conf.js", // Target-specific config file
					args: {} // Target-specific arguments
				}
			},
		},
		compass: {
			app_dist: { // target
				options: { // Target options
					// config: 'config/config.rb',
					sassDir: ['app/sass', 'components/mcmMap/sass'],
					cssDir: ['app/css'],
					outputStyle: "nested",
					environment: 'production',
					noLineComments: true,
					require: ["susy", "breakpoint"],
					trace: true
				}
			},
			app_dev: { // Another target
				options: {
					sassDir: ['app/sass'],
					cssDir: ['app/css'],
					outputStyle: "nested", // expanded, nested, compact, compressed
					environment: 'development',
					noLineComments: false,
					require: ["susy", "breakpoint"],
					trace: true
				}
			},
			map_dist: { // target
				options: { // Target options
					// config: 'config/config.rb',
					sassDir: ['components/mcmMap/sass'],
					cssDir: ['components/mcmMap/css'],
					outputStyle: "nested",
					environment: 'production',
					noLineComments: true,
					require: ["susy", "breakpoint"],
					trace: true
				}
			},
			map_dev: { // Another target
				options: {
					sassDir: ['components/mcmMap/sass'],
					cssDir: ['components/mcmMap/css'],
					outputStyle: "nested", // expanded, nested, compact, compressed
					environment: 'development',
					noLineComments: false,
					require: ["susy", "breakpoint"],
					trace: true
				}
			},
			maps_dist: { // target
				options: { // Target options
					// config: 'config/config.rb',
					sassDir: ['components/mcmMaps/sass'],
					cssDir: ['components/mcmMaps/css'],
					outputStyle: "nested",
					environment: 'production',
					noLineComments: true,
					require: ["susy", "breakpoint"],
					trace: true
				}
			},
			maps_dev: { // Another target
				options: {
					sassDir: ['components/mcmMaps/sass'],
					cssDir: ['components/mcmMaps/css'],
					outputStyle: "nested", // expanded, nested, compact, compressed
					environment: 'development',
					noLineComments: false,
					require: ["susy", "breakpoint"],
					trace: true
				}
			}
		},
		concat: {
			// https://www.npmjs.com/package/grunt-contrib-concat
			// http://gruntjs.com/configuring-tasks#globbing-patterns
			options: {
				// define a string to put between each file in the concatenated output
				separator: grunt.util.linefeed // ';' // https://github.com/gruntjs/grunt-contrib-concat#separator
			},
			dist: {
				// the files to concatenate
				src: [
					'app/js/**/*.js',
					'!app/js/lib/**/*.js'
				],
				// the location of the resulting JS file
				dest: 'dist/<%= pkg.name %>.js'
			}
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			build: {
				src: 'dist/<%= pkg.name %>.js',
				dest: 'build/<%= pkg.name %>.min.js'
			}
		},
		watch: {
			js: {
				files: ['<%= jshint.files %>'],
				tasks: ['jshint', 'notify:watch_js']
			},
			app_css: {
				files: ['app/sass/**/*.{scss,sass}'],
				tasks: ['compass:app_dev', 'notify:watch_css'],
			},
			map_css: {
				files: ['components/mcmMap/sass/**/*.{scss,sass}'],
				tasks: ['compass:map_dev', 'notify:watch_css'],
			},
			maps_css: {
				files: ['components/mcmMaps/sass/**/*.{scss,sass}'],
				tasks: ['compass:maps_dev', 'notify:watch_css'],
			}
		},
		concurrent: {
			watch: {
				tasks: ['watch:js', 'watch:app_css', 'watch:map_css', 'watch:maps_css'],
				options: { logConcurrentOutput: true }
			},
			dev: {
				tasks: ['jshint', 'compass:app_dev', 'compass:map_dev', 'compass:maps_dev'],
				options: { logConcurrentOutput: true }
			},
			dist: {
				tasks: ['jshint', 'compass:app_dist', 'compass:map_dist', 'compass:map_dist'],
				options: { logConcurrentOutput: true }
			}
		},
		notify: {
			watch_js: {
				options: {
					title: "<%= pkg.name %>", // defaults to the name in package.json, or will use project directory's name
					message: 'JSHint finished running', //required
				}
			},
			'watch_css': {
				options: {
					title: "<%= pkg.name %>", // defaults to the name in package.json, or will use project directory's name
					message: 'SASS finished running', //required
				}
			}
		}
	});
	
	// Load plugins that provides the "uglify", ... tasks
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-karma');
	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-notify');
	
	// Default task(s).
	grunt.registerTask('default', ['concurrent:dev', 'concurrent:watch']);
	grunt.registerTask('build', ['jshint', 'compass', 'concat', 'uglify', 'compass:dist']);
	grunt.registerTask('test', ['jshint', /* 'qunit'*/]);
};

}()); // end of 'use strict';