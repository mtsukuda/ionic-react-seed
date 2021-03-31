const gulp = require('gulp');
const chalk = require('chalk');
const gulpfs = require('./gulplib/gulpfs');
const SLS_PATH = 'seed/app/slspath';
const SLS_STACK_PATH = '.serverless/stack.json';

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
  if(gulpfs.fileExists(SLS_PATH) === false) {
    let slsPath = { OwnSlsApiPath: "", ServiceEndpoint: ""};
    gulpfs.writeDistFile(SLS_PATH, JSON.stringify(slsPath, null, 2));
    throw new Error("Require SLS path -> seed/app/slspath");
  }
  let slsPath = JSON.parse(gulpfs.readWholeFile(SLS_PATH));
  console.log(slsPath.OwnSlsApiPath);
  if (!slsPath.OwnSlsApiPath) {
    // eslint-disable-next-line no-throw-literal
    throw new Error("Require SLS path -> seed/app/slspath");
  }
  if(gulpfs.fileExists(`${slsPath.OwnSlsApiPath}/${SLS_STACK_PATH}`) === false) {
    throw new Error(`Could not find SLS stack -> ${slsPath.OwnSlsApiPath}/${SLS_STACK_PATH}`);
  }
  let slsStackJSON = JSON.parse(gulpfs.readWholeFile(`${slsPath.OwnSlsApiPath}/${SLS_STACK_PATH}`));
  if (!slsStackJSON.ServiceEndpoint) {
    throw new Error("Require ServiceEndpoint in stack file");
  }
  slsPath['ServiceEndpoint'] = slsStackJSON.ServiceEndpoint;
  gulpfs.writeDistFile(SLS_PATH, JSON.stringify(slsPath, null, 2));
};
