const gulp = require('gulp');
const chalk = require('chalk');
const gulpfs = require('../gulplib/gulpfs');
const PACKAGE_JSON = 'package.json';

/**
 * Rename Package Name
 */
gulp.task('rename-package-name', async function (done){
  console.log(' 🚀🚀🚀 ' + chalk.bgBlue(' rename-package-name ') + ' 🚀🚀🚀 ');
  let ionicProjectPackageJSONPath = `../${PACKAGE_JSON}`;
  let packageJSON = gulpfs.JSONdata(ionicProjectPackageJSONPath, false);
  let dirArray = __dirname.split('/');
  let newPackageName = dirArray[dirArray.length - 2];
  console.log(`RENAMED PACKAGE: ${packageJSON.name} ==> ${newPackageName}`);
  packageJSON.name = newPackageName;
  gulpfs.writeDistFile(ionicProjectPackageJSONPath, JSON.stringify(packageJSON, null, 2));
  done();
});

/**
 * gulp default task
 */
gulp.task('default',
  gulp.series(gulp.parallel(
    'rename-package-name',
  ), function (done) {
    done();
  })
);
