module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: ['Gruntfile.js', 'js/**/*.js']
    },
    browserify: {
      dist: {
        files: {
          'app/app.js': ['js/*.js'],
        }
      }
    },
    connect: {
      server: {
        options: {
          port: 8008,
          base: '.',
          livereload: true

        }
      }
    },
    watch: {
      scripts: {
        files: ['js/**/*.js', 'sass/*.scss'],
        tasks: ['browserify', 'compass'],
        options: {
          spawn: false,
        },
      },
    },
    compass: {                  // Task
      dist: {                   // Target
        options: {              // Target options
          sassDir: 'sass',
          cssDir: 'app/css'
        }
      }
    }


  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-browserify');

  // Default task(s).
  grunt.registerTask('default', ['browserify', 'compass', 'connect', 'watch']);

};