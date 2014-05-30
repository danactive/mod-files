/*global module*/

module.exports = function (grunt) {
	"use strict";

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		simplemocha: {
			all: {
				src: [
					'./tests/*.js'
				]
			}
		}
	});

	grunt.loadNpmTasks('grunt-simple-mocha');

	grunt.registerTask('validate', ['simplemocha']);
};
