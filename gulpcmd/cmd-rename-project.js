const gulp = require('gulp');
const chalk = require('chalk');
const gulpfs = require('../gulplib/gulpfs');
const PACKAGE_JSON = 'package.json';
const SERVERLESS_TS = 'serverless.ts';
const DEFAULT_SERVICE_NAME = "'sls-front-api-seed'";

/**
 * Rename the project
 */
gulp.task('rename-project', async function (done){
  console.log(' 🚀🚀🚀 ' + chalk.bgBlue(' rename-project ') + ' 🚀🚀🚀 ');
  let packageJSON = gulpfs.JSONdata(`../${PACKAGE_JSON}`, false);
  let newProjectName = `${packageJSON.name}-api`;
  let newProjectPackageJSONPath = `../../${newProjectName}/${PACKAGE_JSON}`;
  let serverlessTsPath = `../../${newProjectName}/${SERVERLESS_TS}`
  if(gulpfs.fileExists(newProjectPackageJSONPath) === false) {
    throw new Error(`Could not find project or package.json file. -> ${newProjectName}`);
  }
  if(gulpfs.fileExists(serverlessTsPath) === false) {
    throw new Error(`Could not find ${SERVERLESS_TS}. -> ${serverlessTsPath}`);
  }
  let newProjectPackageJSON = gulpfs.JSONdata(newProjectPackageJSONPath, false);
  newProjectPackageJSON.name = newProjectName;
  gulpfs.writeDistFile(newProjectPackageJSONPath, JSON.stringify(newProjectPackageJSON, null, 2));
  let appTsFileBuffer = gulpfs.readWholeFile(serverlessTsPath);
  appTsFileBuffer = _replaceString(DEFAULT_SERVICE_NAME, `'${newProjectName}'`, appTsFileBuffer);
  gulpfs.writeDistFile(serverlessTsPath, appTsFileBuffer);
  done();
});

/**
 * gulp default task
 */
gulp.task('default',
  gulp.series(gulp.parallel(
    'rename-project',
  ), function (done) {
    done();
  })
);

let _replaceString = function (targetString, replacedString, buffer) {
  targetString = new RegExp(targetString,'g');
  console.log('REPLACE: ' + targetString + ' ==> ' + replacedString);
  return buffer.replace(targetString, replacedString);
};

