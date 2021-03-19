const gulp = require('gulp');
const FS = require('fs');
const chalk = require('chalk');

/**
 * Copy Menu
 */
gulp.task('create-api', function (done){
  console.log(' 🚀🚀🚀 ' + chalk.bgBlue(' create-api ') + ' 🚀🚀🚀 ');
  done();
});

/**
 * gulp default task
 */
gulp.task('default',
  gulp.series(gulp.parallel(
    'create-api',
  ), function (done) {
    done();
  })
);
