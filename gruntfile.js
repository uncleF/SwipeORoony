//Gruntfile for the Slideroony Project

var BUILD_DIR					= "src",							// Project Build
		DEVELOPMENT_DIR		= "dev",								// Project Development
		DEMO_DIR 					= "demo",								// Project Demo
		JS_FILENAME				= "slideroony";					// Production JavaScript Filename

module.exports = function(grunt) {

	var project = {
		init: function() {
			this.dir = DEVELOPMENT_DIR + "/";
			this.build = BUILD_DIR + "/";
			this.demo = DEMO_DIR + "/";
			this.filename = JS_FILENAME;
			return this;
		}
	}.init();

	require("load-grunt-tasks")(grunt);

	grunt.initConfig({

		jshint: {
			options: {
				"jshintrc": ".jshintrc"
			},
			jsHint: {
				cwd: project.dir,
				src: ["*.js"],
				expand: true
			}
		},
		jsinspect: {
			jsInspect: {
				cwd: project.dir,
				src: ["*.js"],
				expand: true
			}
		},

		removelogging: {
			jsClean: {
				cwd: project.build,
				src: ["*.js"],
				dest: project.build,
				expand: true
			}
		},
		fixmyjs: {
			options: {
				config: ".jshintrc",
				indentpref: "tabs"
			},
			fixMyJS: {
				cwd: project.build,
				src: ["*.js"],
				dest: project.build,
				expand: true
			}
		},
		uglify: {
			options: {
				preserveComments: false
			},
			jsMin: {
				cwd: project.build,
				src: ["*.js"],
				dest: project.build,
				ext: ".min.js",
				expand: true
			}
		},

		clean: {
			build: [project.build]
		},
		copy: {
			build: {
				cwd: project.dir,
				src: ["**/*.js"],
				dest: project.build,
				expand: true
			},
			demo: {
				cwd: project.build,
				src: ["*.min.js"],
				dest: project.demo,
				expand: true
			}
		},
		compress: {
			jsGzip: {
				options: {
					mode: "gzip"
				},
				cwd: project.build,
				src: ["*.min.js"],
				dest: project.build,
				ext: ".min.js.gz",
				expand: true
			}
		}

	});

	grunt.registerTask("quality", ["jshint", "jsinspect"]);

	grunt.registerTask("compile", ["removelogging", "fixmyjs", "uglify"]);

	grunt.registerTask("build", ["clean:build", "copy:build", "compile", "compress", "copy:demo"]);

};
