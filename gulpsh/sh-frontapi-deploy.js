const gulp = require('gulp');
const chalk = require('chalk');
const exec = require("exec-sh").promise;
const gulpfs = require('../gulplib/gulpfs');

/**
 * Front Api deploy
 */
gulp.task('front-api-deploy', async function (done){
  console.log(' 🚀🚀🚀 ' + chalk.bgBlue(' front-api-deploy ') + ' 🚀🚀🚀 ');
  let packageJSON = gulpfs.JSONdata('../package.json', false);
  let apiPath = `../../${packageJSON.name}-api`;
  let out;
  try {
    out = await exec(`yarn --cwd ${apiPath} sls deploy`, true);
  } catch (e) {
    console.log('Error: ', e);
    console.log('Stderr: ', e.stderr);
    console.log('Stdout: ', e.stdout);
    return e;
  }
  console.log(out);
  done();
});

/**
 * gulp default task
 */
gulp.task('default',
  gulp.series(gulp.parallel(
    'front-api-deploy',
  ), function (done) {
    done();
  })
);

