const gulp = require('gulp');
const chalk = require('chalk');
const gulpfs = require('./gulplib/gulpfs');
const SLSPATH = 'seed/app/slspath';

/**
 * API update
 */
gulp.task('pull-endpoint', function (done){
  console.log(' 🚀🚀🚀 ' + chalk.bgBlue(' pull-endpoint ') + ' 🚀🚀🚀 ');
  _checkSlsPath();
  done();
});

/**
 * gulp default task
 */
gulp.task('default',
  gulp.series(gulp.parallel(
    'pull-endpoint',
  ), function (done) {
    done();
  })
);

let _checkSlsPath = function () {
  if(gulpfs.fileExists(SLSPATH) === false) {
    let slsPath = { OwnSlsApiPath: "" };
    gulpfs.writeDistFile(SLSPATH, JSON.stringify(slsPath, null, 2));
  } else {
    let slsPath = JSON.parse(gulpfs.readWholeFile(SLSPATH));
    console.log(slsPath.OwnSlsApiPath);
    if (!slsPath.OwnSlsApiPath) {
      throw "Require SLS path -> seed/app/slspath";
    }
  }
};
