const gulp = require('gulp');
const chalk = require('chalk');
const gulpfs = require('./gulplib/gulpfs');
const SLS_CONFIG_JSON_PATH = 'seed/app/sls-config.json';
const SLS_STACK_JSON_PATH = '.serverless/stack.json';

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
  if(gulpfs.fileExists(SLS_CONFIG_JSON_PATH) === false) {
    let slsPath = { OwnSlsApiPath: "", ServiceEndpoint: ""};
    gulpfs.writeDistFile(SLS_CONFIG_JSON_PATH, JSON.stringify(slsPath, null, 2));
    throw new Error(`Require SLS path -> ${SLS_CONFIG_JSON_PATH}`);
  }
  let slsPath = JSON.parse(gulpfs.readWholeFile(SLS_CONFIG_JSON_PATH));
  console.log(slsPath.OwnSlsApiPath);
  if (!slsPath.OwnSlsApiPath) {
    // eslint-disable-next-line no-throw-literal
    throw new Error(`Require SLS path -> ${SLS_CONFIG_JSON_PATH}`);
  }
  if(gulpfs.fileExists(`${slsPath.OwnSlsApiPath}/${SLS_STACK_JSON_PATH}`) === false) {
    throw new Error(`Could not find SLS stack -> ${slsPath.OwnSlsApiPath}/${SLS_STACK_JSON_PATH}`);
  }
  let slsStackJSON = JSON.parse(gulpfs.readWholeFile(`${slsPath.OwnSlsApiPath}/${SLS_STACK_JSON_PATH}`));
  if (!slsStackJSON.ServiceEndpoint) {
    throw new Error("Require ServiceEndpoint in stack file");
  }
  slsPath['ServiceEndpoint'] = slsStackJSON.ServiceEndpoint;
  gulpfs.writeDistFile(SLS_CONFIG_JSON_PATH, JSON.stringify(slsPath, null, 2));
};
