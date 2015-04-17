# TODO: copy app folder to public/app, replace jade with htmls

module.exports = (grunt) ->
  require('load-grunt-tasks')(grunt)
  path = require('path')

  grunt.initConfig
    watch:
      options:
        livereload: true
      express:
        files: [ "**/*.js", "**/*.jade", "Gruntfile.*", "!public/**/*.js" ]
        tasks: ["express:dev"]
        options:
          spawn: false
      jade:
        files: [ "app/**/*.jade" ]
        tasks: [ "jade:compile" ]
      copy:
        files: ["app/**/*", "!app/**/*.jade"]
        tasks: [ "copy:app" ]

    express:
      dev:
        options:
          script: 'bin/www'
          livereload: true

    jade:
      compile:
        options:
          pretty: true
        files: [{
          expand: true,
          cwd: "app",
          src: ["**/*.jade", "!common/mixins/*.jade"],
          ext: ".html"
          dest: "public/app/"
        }]

    copy:
      app:
        files: [{
          expand: true,
          cwd: "app",
          src: ["app/**/*", "!app/**/*.jade"],
          dest: "public/app/"
        }]


  grunt.registerTask "default", ["copy", "jade", "express", "watch"]
