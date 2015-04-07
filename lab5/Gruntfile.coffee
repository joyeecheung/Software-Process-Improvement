# concat
# compile
# move
# watch and serve

module.exports = (grunt) ->
  require('load-grunt-tasks')(grunt)
  path = require('path')

  grunt.initConfig
    watch:
      options:
        livereload: true
      express:
        files: [ "**/*.js", "**/*.css", "**/*.html" ]
        tasks: ["express:dev"]
        options:
          spawn: false

    express:
      dev:
        options:
          script: 'server.js'
          livereload: true

  grunt.registerTask "default", ["express", "watch"]
