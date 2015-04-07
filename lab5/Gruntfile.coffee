# concat
# compile
# replace
# move
# watch and serve

module.exports = (grunt) ->
  require('load-grunt-tasks')(grunt)
  path = require('path')

  fileConfigs = []
  for dir in ["S1", "S2", "S3", "S4", "S5"]
    fileConfigs.push
      expand: true,
      cwd: dir,
      src: ['**/*.coffee'],
      dest: path.join(dir, 'js'),
      ext: '.js',
      flatten: true

  copyCommonConfigs = []
  for dir in ["S1", "S2", "S3", "S4", "S5"]
    copyCommonConfigs.push
      expand: true,
      cwd: "common"
      src: ['**/*']
      dest: dir

  grunt.initConfig
    watch:
      options:
        livereload: true
      express:
        files: [ "**/*.js", "**/*.css", "**/*.html" ]
        tasks: ["express:dev"]
        options:
          spawn: false
      common:
        files: [ "common/**/*" ]
        tasks: [ "copy:common" ]
      coffee:
        files: [ "**/*.coffee" ]
        tasks: ["coffee:compile"]

    copy:
      common:
        files: copyCommonConfigs

    express:
      dev:
        options:
          script: 'server.js'
          livereload: true

    coffee:
      compile:
        files: fileConfigs

  grunt.registerTask "default", ["copy", "coffee", "express", "watch"]
