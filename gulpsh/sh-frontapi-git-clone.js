const gulp = require('gulp');
const chalk = require('chalk');
const exec = require("exec-sh").promise;
const gulpFs = require('../gulplib/gulpfs');
const pullEndPoint = require('../gulpcmd/cmd-pull-endpoint');

/**
 * Front Api Seed git clone
 */
gulp.task('git-clone', async function (done){
  console.log(' 🚀🚀🚀 ' + chalk.bgBlue(' git-clone ') + ' 🚀🚀🚀 ');
  let packageJSON = gulpFs.JSONdata('../package.json', false);
  let clonedName = `${packageJSON.name}-api`;
  if(gulpFs.fileExists(`../../${clonedName}`)) {
    console.log(chalk.red(`Already exist front API -> ${clonedName}`));
    done();
    return;
  }
  let out;
  try {
    out = await exec(`git clone git@github.com:mtsukuda/sls-front-api-seed.git ../../${clonedName}`, true);
  } catch (e) {
    console.log('Error: ', e);
    console.log('Stderr: ', e.stderr);
    console.log('Stdout: ', e.stdout);
    return e;
  }
  console.log(out);
  pullEndPoint.createDefaultFrontApiConfigJson();
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

