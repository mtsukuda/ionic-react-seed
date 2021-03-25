const _ = require('lodash');
const gulp = require('gulp');
const chalk = require('chalk');
const gulpfs = require('./gulplib/gulpfs');
const API_ID = 'seed/app/api-id'
const USER_PAGE_JSON = 'seed/user-pages';
const USER_COMPONENT_JSON = 'seed/user-components';

/**
 * Copy Menu
 */
gulp.task('create-api', function (done){
  console.log(' 🚀🚀🚀 ' + chalk.bgBlue(' create-api ') + ' 🚀🚀🚀 ');
  let apiId = _getApiId();
  console.log(apiId);
  let userPagesJSONFilePaths = gulpfs.jsonFilePaths(USER_PAGE_JSON);
  let fetchData = [];
  if (userPagesJSONFilePaths !== null && userPagesJSONFilePaths.length > 0) {
    _extractFetchData(userPagesJSONFilePaths, fetchData);
  }
  let userComponentsJSONFilePaths = gulpfs.jsonFilePaths(USER_COMPONENT_JSON);
  if (userComponentsJSONFilePaths !== null && userComponentsJSONFilePaths.length > 0) {
    _extractFetchData(userComponentsJSONFilePaths, fetchData);
  }
  console.log(fetchData);
  _createApiData(fetchData);
  done();
});

/**
 * gulp default task
 */
gulp.task('default',
  gulp.series(gulp.parallel(
    'create-api',
  ), function (done) {
    done();
  })
);

let _getApiId = function () {
  if(gulpfs.fileExists(API_ID) === false) {
    let packageJSON = gulpfs.JSONdata('package.json');
    console.log(packageJSON.name);
    let apiId = `${packageJSON.name}-${Math.random().toString(32).substring(2)}`;
    gulpfs.writeDistFile(API_ID, `${apiId}`);
  } else {
    return gulpfs.readWholeFile(API_ID);
  }
};

let _extractFetchData = function (componentConfigJSONFilePaths, fetchData) {
  _.forEach(componentConfigJSONFilePaths, (componentConfigJSONFilePath) => {
    let componentConfigJSON = gulpfs.JSONdata(componentConfigJSONFilePath);
    _.forEach(componentConfigJSON, (value, key) => {
      if (key === 'fetch') {
        _.forEach(value, (fetch) => {
          fetchData.push(fetch);
        });
      }
    });
  });
}

let _createApiData = function (fetchData) {
  _.forEach(fetchData, (fetch) => {
    console.log(fetch.format);
    _.forEach(fetch.apis, (api) => {
      console.log(api.uri);
    });
  });
}
