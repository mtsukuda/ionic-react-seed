const gulp = require('gulp');
const FS = require('fs');
const chalk = require('chalk');
const gulpfs = require('./gulplib/gulpfs');
const USER_PAGE_JSON = 'seed/user-pages';
const USER_COMPONENT_JSON = 'seed/user-components';

/**
 * Copy Menu
 */
gulp.task('create-api', function (done){
  console.log(' 🚀🚀🚀 ' + chalk.bgBlue(' create-api ') + ' 🚀🚀🚀 ');
  let userPagesJSONFilePaths = gulpfs.jsonFilePaths(USER_PAGE_JSON);
  let userComponentsJSONFilePaths = gulpfs.jsonFilePaths(USER_COMPONENT_JSON);
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
