const gulp = require('gulp');
const chalk = require('chalk');
const gulpfs = require('../gulplib/gulpfs');
const FRONT_API_CONFIG_JSON_PATH = '../seed/app/front-api-config.json';
const SLS_STACK_JSON_PATH = '.serverless/stack.json';

/**
 * Pull Front API Endpoint
 */
gulp.task('pull-endpoint', function (done){
  console.log(' 🚀🚀🚀 ' + chalk.bgBlue(' pull-endpoint ') + ' 🚀🚀🚀 ');
  let dirArray = __dirname.split('/');
  dirArray.pop();
  let defaultApiPath = dirArray.join('/') + '-api';
  console.log(defaultApiPath);
  _checkFrontApiConfigPath(defaultApiPath);
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

let _checkFrontApiConfigPath = function (defaultApiPath) {
  if(gulpfs.fileExists(FRONT_API_CONFIG_JSON_PATH) === false) {
    module.exports.createDefaultFrontApiConfigJson(defaultApiPath);
  }
  let frontApiConfig = JSON.parse(gulpfs.readWholeFile(FRONT_API_CONFIG_JSON_PATH));
  if (frontApiConfig.FrontApiProjectPath) {
    if (gulpfs.fileExists(`${frontApiConfig.FrontApiProjectPath}/${SLS_STACK_JSON_PATH}`) === false) {
      throw new Error(`Could not find SLS stack -> ${frontApiConfig.FrontApiProjectPath}/${SLS_STACK_JSON_PATH}`);
    }
    let slsStackJSON = JSON.parse(gulpfs.readWholeFile(`${frontApiConfig.FrontApiProjectPath}/${SLS_STACK_JSON_PATH}`));
    if (!slsStackJSON.ServiceEndpoint) {
      throw new Error("Require ServiceEndpoint in stack file");
    }
    frontApiConfig['FrontApiEndPoint'] = slsStackJSON.ServiceEndpoint;
    gulpfs.writeDistFile(FRONT_API_CONFIG_JSON_PATH, JSON.stringify(frontApiConfig, null, 2));
  } else {
    throw new Error(`Require SLS path -> ${FRONT_API_CONFIG_JSON_PATH}`);
  }
};

module.exports.createDefaultFrontApiConfigJson = (defaultFrontApiPath) => {
  if(gulpfs.fileExists(FRONT_API_CONFIG_JSON_PATH)) throw new Error(`Front API config is exist! ${FRONT_API_CONFIG_JSON_PATH}`);
  let frontApiConfig = { FrontApiProjectPath: defaultFrontApiPath, FrontApiEndPoint: ""};
  gulpfs.writeDistFile(FRONT_API_CONFIG_JSON_PATH, JSON.stringify(frontApiConfig, null, 2));
};

module.exports.frontApiConfigJsonPath = () => {
  return FRONT_API_CONFIG_JSON_PATH.replace('../', '');
};
