const _ = require('lodash');
const gulp = require('gulp');
const FS = require('fs');

/**
 * Create User Components
 */
gulp.task('create-user-components', function (done) {
  done();
});

/**
 * Create User Pages
 */
gulp.task('create-user-pages', function (done){
  done();
});

/**
 * gulp default task
 */
gulp.task('default',
  gulp.series(gulp.parallel(
    'create-user-components',
    'create-user-pages'
  ), function (done) {
    done();
  })
);

