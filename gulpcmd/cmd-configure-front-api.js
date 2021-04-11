const _ = require('lodash');
const gulp = require('gulp');
const chalk = require('chalk');
const gulpfs = require('../gulplib/gulpfs');
const gulpconst = require('../gulplib/gulpconst');
const pullEndPoint = require('../gulpcmd/cmd-pull-endpoint');
const USER_PAGE_JSON = '../seed/user-pages';
const USER_COMPONENT_JSON = '../seed/user-components';
const FRONT_API_FUNCTIONS_CONFIG = 'seed/functions/config.json';

/**
 * Configure Front API
 */
gulp.task('configure-front-api', function (done){
  console.log(' 🚀🚀🚀 ' + chalk.bgBlue(' configure-front-api ') + ' 🚀🚀🚀 ');
  let projectPath = _frontApiProjectPath();
  if (projectPath === false) {
    throw new Error("Could not find API project file.");
  }
  let userPagesJSONFilePaths = gulpfs.jsonFilePaths(USER_PAGE_JSON);
  let fetchData = [];
  if (userPagesJSONFilePaths !== null && userPagesJSONFilePaths.length > 0) {
    _extractFetchData(userPagesJSONFilePaths, fetchData);
  }
  let userComponentsJSONFilePaths = gulpfs.jsonFilePaths(USER_COMPONENT_JSON);
  if (userComponentsJSONFilePaths !== null && userComponentsJSONFilePaths.length > 0) {
    _extractFetchData(userComponentsJSONFilePaths, fetchData);
  }
  let functionJSON = { functions: [] };
  _createApiData(fetchData, functionJSON);
  console.log(functionJSON);
  let frontApiFunctionsPath = `${projectPath}/${FRONT_API_FUNCTIONS_CONFIG}`;
  gulpfs.writeDistFile(frontApiFunctionsPath, JSON.stringify(functionJSON, null, 2));
  done();
});

/**
 * gulp default task
 */
gulp.task('default',
  gulp.series(gulp.parallel(
    'configure-front-api',
  ), function (done) {
    done();
  })
);

let _frontApiProjectPath = function () {
  let frontApiConfigJsonPath = `../${pullEndPoint.frontApiConfigJsonPath()}`;
  if(gulpfs.fileExists(frontApiConfigJsonPath) === false) {
    return false;
  }
  let frontApiConfigJson = JSON.parse(gulpfs.readWholeFile(frontApiConfigJsonPath));
  if (!frontApiConfigJson) {
    return false;
  }
  return frontApiConfigJson.FrontApiProjectPath;
}

let _extractFetchData = function (componentConfigJSONFilePaths, fetchData) {
  _.forEach(componentConfigJSONFilePaths, (componentConfigJSONFilePath) => {
    let componentConfigJSON = gulpfs.JSONdata(componentConfigJSONFilePath, false);
    _.forEach(componentConfigJSON, (value, key) => {
      if (key === 'fetch') {
        _.forEach(value, (fetch) => {
          fetchData.push(fetch);
        });
      }
    });
  });
}

let _createApiData = function (fetchData, functionJSON) {
  _.forEach(fetchData, (fetch) => {
    _.forEach(fetch.apis, (api) => {
      if (gulpconst.slsFrontApiUri() === api.uri) {
        if (api.config.path === undefined) throw new Error("Could not find 'api.config.path'!");
        let functionConfig = { method: fetch.method, path: api.config.path };
        if (api.config.mock) {
          functionConfig['mock'] = api.config.mock;
        }
        if (api.config.schema) {
          functionConfig['schema'] = api.config.schema;
        }
        console.log(fetch.method);
        console.log(api.config)
        functionJSON.functions.push(functionConfig);
      }
    });
  });
}
