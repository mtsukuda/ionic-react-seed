const gulp = require('gulp');
const chalk = require('chalk');
const exec = require("exec-sh").promise;
const gulpfs = require('./gulplib/gulpfs');

/**
 * Front Api Seed git clone
 */
gulp.task('git-clone', async function (done){
  console.log(' 🚀🚀🚀 ' + chalk.bgBlue(' git-clone ') + ' 🚀🚀🚀 ');
  let packageJSON = gulpfs.JSONdata('package.json');
  let clonedName = `${packageJSON.name}-api`;
  if(gulpfs.fileExists(`../${clonedName}`)) {
    throw new Error(`Already exist front API -> ${clonedName}`);
  }
  let out;
  try {
    out = await exec(`git clone git@github.com:mtsukuda/sls-front-api-seed.git ../${clonedName}`, true);
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
    'git-clone',
  ), function (done) {
    done();
  })
);

