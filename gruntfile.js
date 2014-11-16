module.exports = function(grunt) {
    'use strict';
    // Project configuration.
    grunt.initConfig({
        jasmine: {
            /* Libs are not requirejs, so we need to specify the location */
            src: './scripts/lib/*.js', 
            options: {
                specs: './tests/unit/specs/**/*.spec.js',
                template: require('grunt-template-jasmine-requirejs'),
                templateOptions: {
                    requireConfigFile: './scripts/main.js',
                    requireConfig: {
                      baseUrl: './scripts',
                      paths: {
                        'mock' : '../tests/unit/mock',
                        'psomd3eventhandler' : 'visualisations/psomd3eventhandler'
                      }   
                    }
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-jasmine');
};
