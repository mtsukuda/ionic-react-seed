const gulp = require('gulp');
const chalk = require('chalk');
const gulpfs = require('../gulplib/gulpfs');
const FRONT_API_CONFIG_JSON_PATH = '../seed/app/front-api-config.json';
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
  if(gulpfs.fileExists(FRONT_API_CONFIG_JSON_PATH) === false) {
    let slsPath = { FrontApiProjectPath: defaultApiPath, FrontApiEndPoint: ""};
    gulpfs.writeDistFile(FRONT_API_CONFIG_JSON_PATH, JSON.stringify(slsPath, null, 2));
  }
  let slsPath = JSON.parse(gulpfs.readWholeFile(FRONT_API_CONFIG_JSON_PATH));
  if (slsPath.FrontApiProjectPath) {
    if (gulpfs.fileExists(`${slsPath.FrontApiProjectPath}/${SLS_STACK_JSON_PATH}`) === false) {
      throw new Error(`Could not find SLS stack -> ${slsPath.FrontApiProjectPath}/${SLS_STACK_JSON_PATH}`);
    }
    let slsStackJSON = JSON.parse(gulpfs.readWholeFile(`${slsPath.FrontApiProjectPath}/${SLS_STACK_JSON_PATH}`));
    if (!slsStackJSON.FrontApiEndPoint) {
      throw new Error("Require FrontApiEndPoint in stack file");
    }
    slsPath['FrontApiEndPoint'] = slsStackJSON.FrontApiEndPoint;
    gulpfs.writeDistFile(FRONT_API_CONFIG_JSON_PATH, JSON.stringify(slsPath, null, 2));
  } else {
    throw new Error(`Require SLS path -> ${FRONT_API_CONFIG_JSON_PATH}`);
  }
};

exports.frontApiConfigJsonPath = () => {
  return FRONT_API_CONFIG_JSON_PATH.replace('../', '');
}
