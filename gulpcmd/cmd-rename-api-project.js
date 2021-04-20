const gulp = require('gulp');
const chalk = require('chalk');
const gulpFs = require('../gulplib/gulpfs');
const PACKAGE_JSON = 'package.json';

/**
 * Rename the API project
 */
gulp.task('rename-api-project', async function (done){
  console.log(' 🚀🚀🚀 ' + chalk.bgBlue(' rename-api-project ') + ' 🚀🚀🚀 ');
  let packageJSON = gulpFs.JSONdata(`../${PACKAGE_JSON}`, false);
  let newProjectName = `${packageJSON.name}-api`;
  let newProjectPackageJSONPath = `../../${newProjectName}/${PACKAGE_JSON}`;
  if(gulpFs.fileExists(newProjectPackageJSONPath) === false) {
    throw new Error(`Could not find project or package.json file. -> ${newProjectName}`);
  }
  let newProjectPackageJSON = gulpFs.JSONdata(newProjectPackageJSONPath, false);
  newProjectPackageJSON.name = newProjectName;
  gulpFs.writeDistFile(newProjectPackageJSONPath, JSON.stringify(newProjectPackageJSON, null, 2));
  done();
});

/**
 * gulp default task
 */
gulp.task('default',
  gulp.series(gulp.parallel(
    'rename-api-project',
  ), function (done) {
    done();
  })
);
