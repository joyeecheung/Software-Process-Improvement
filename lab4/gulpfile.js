var gulp = require('gulp');
var htmlreplace = require('gulp-html-replace');
var concat = require('gulp-concat');
var folders = ["S1", "S2", "S3", "S4", "S5"];
var path = require('path');
var merge = require('merge-stream');

gulp.task('copy', function() {
  var tasks = folders.map(function(folder) {
    var toCopy = ['assets/*', 'css/*', 'index.html'];
    toCopy = toCopy.map(function(place) {
      return path.join(folder, place);
    });

    return gulp.src(toCopy, {
        base: folder
      }).pipe(gulp.dest(path.join('./dist/', folder));
  });

  return merge(tasks);
});

gulp.task('concat', function() {
  var tasks = folders.map(function(folder) {
    var toConcat = ['util.js', 'promise.js', 'ajax.js', 'bubble.js'];
    toConcat = toCopy.map(function(file) {
      return path.join(folder, 'js', file);
    });

    return gulp.src(toConcat)
        .pipe(concat('index.js'))
        .pipe(gulp.dest(path.join('./dist/', folder));
  });

  return merge(tasks);
});

gulp.task('merge', function() {
  var tasks = folders.map(function(folder) {
    return gulp.src(path.join(folder, 'index.html'))
        .pipe(htmlreplace({
          'js': 'index.js'
        }))
        .pipe(gulp.dest(path.join('./dist/', folder));
  });

  return merge(tasks);
});

gulp.task('server', function() {
  return gulp.src('./server.js').pipe(gulp.dest('./dist'));
});

gulp.task('default', ['copy', 'concat', 'merge']);
