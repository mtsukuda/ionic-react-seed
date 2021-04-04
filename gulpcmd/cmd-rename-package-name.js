const gulp = require('gulp');
const chalk = require('chalk');
const gulpfs = require('../gulplib/gulpfs');
const PACKAGE_JSON = 'package.json';
const IONIC_CONFIG_JSON = 'ionic.config.json';

/**
 * Rename Package Name
 */
gulp.task('rename-package-name', async function (done){
  console.log(' 🚀🚀🚀 ' + chalk.bgBlue(' rename-package-name ') + ' 🚀🚀🚀 ');
  let ionicProjectPackageJSONPath = `../${PACKAGE_JSON}`;
  let packageJSON = gulpfs.JSONdata(ionicProjectPackageJSONPath, false);
  let newPackageName = _newPackageName();
  console.log(`RENAMED PACKAGE: ${packageJSON.name} ==> ${newPackageName}`);
  packageJSON.name = newPackageName;
  gulpfs.writeDistFile(ionicProjectPackageJSONPath, JSON.stringify(packageJSON, null, 2));
  done();
});

/**
 * Rename Ionic Config Name
 */
gulp.task('rename-ionic-config-name', async function (done){
  console.log(' 🚀🚀🚀 ' + chalk.bgBlue(' rename-ionic-config-name ') + ' 🚀🚀🚀 ');
  let ionicConfigJSONPath = `../${IONIC_CONFIG_JSON}`;
  let configJSON = gulpfs.JSONdata(ionicConfigJSONPath, false);
  let newPackageName = _newPackageName();
  console.log(`RENAMED IONIC CONFIG: ${configJSON.name} ==> ${newPackageName}`);
  configJSON.name = newPackageName;
  gulpfs.writeDistFile(ionicConfigJSONPath, JSON.stringify(configJSON, null, 2));
  done();
});

/**
 * gulp default task
 */
gulp.task('default',
  gulp.series(gulp.parallel(
    'rename-package-name',
    'rename-ionic-config-name',
  ), function (done) {
    done();
  })
);

let _newPackageName = function () {
  let dirArray = __dirname.split('/');
  return dirArray[dirArray.length - 2];
}
