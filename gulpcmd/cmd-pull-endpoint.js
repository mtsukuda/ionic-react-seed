const gulp = require('gulp');
const chalk = require('chalk');
const gulpfs = require('../gulplib/gulpfs');
const SLS_CONFIG_JSON_PATH = '../seed/app/sls-config.json';
const SLS_STACK_JSON_PATH = '.serverless/stack.json';

/**
 * Pull API Endpoint
 */
gulp.task('pull-endpoint', function (done){
  console.log(' 🚀🚀🚀 ' + chalk.bgBlue(' pull-endpoint ') + ' 🚀🚀🚀 ');
  let dirArray = __dirname.split('/');
  dirArray.pop();
  let defaultApiPath = dirArray.join('/') + '-api';
  console.log(defaultApiPath);
  _checkSlsPath(defaultApiPath);
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

let _checkSlsPath = function (defaultApiPath) {
  if(gulpfs.fileExists(SLS_CONFIG_JSON_PATH) === false) {
    let slsPath = { OwnSlsApiPath: defaultApiPath, ServiceEndpoint: ""};
    gulpfs.writeDistFile(SLS_CONFIG_JSON_PATH, JSON.stringify(slsPath, null, 2));
  }
  let slsPath = JSON.parse(gulpfs.readWholeFile(SLS_CONFIG_JSON_PATH));
  if (slsPath.OwnSlsApiPath) {
    if (gulpfs.fileExists(`${slsPath.OwnSlsApiPath}/${SLS_STACK_JSON_PATH}`) === false) {
      throw new Error(`Could not find SLS stack -> ${slsPath.OwnSlsApiPath}/${SLS_STACK_JSON_PATH}`);
    }
    let slsStackJSON = JSON.parse(gulpfs.readWholeFile(`${slsPath.OwnSlsApiPath}/${SLS_STACK_JSON_PATH}`));
    if (!slsStackJSON.ServiceEndpoint) {
      throw new Error("Require ServiceEndpoint in stack file");
    }
    slsPath['ServiceEndpoint'] = slsStackJSON.ServiceEndpoint;
    gulpfs.writeDistFile(SLS_CONFIG_JSON_PATH, JSON.stringify(slsPath, null, 2));
  } else {
    throw new Error(`Require SLS path -> ${SLS_CONFIG_JSON_PATH}`);
  }
};
