const _ = require('lodash');
const gulp = require('gulp');
const chalk = require('chalk');
const gulpfs = require('./gulplib/gulpfs');
const USER_PAGE_JSON = 'seed/user-pages';
const USER_COMPONENT_JSON = 'seed/user-components';

/**
 * Copy Menu
 */
gulp.task('create-api', function (done){
  console.log(' 🚀🚀🚀 ' + chalk.bgBlue(' create-api ') + ' 🚀🚀🚀 ');
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

let _extractFetchData = function (componentConfigJSONFilePaths, buildComponents) {
  _.forEach(componentConfigJSONFilePaths, (componentConfigJSONFilePath) => {
    let componentConfigJSON = gulpfs.JSONdata(componentConfigJSONFilePath);
    _.forEach(componentConfigJSON, (value, key) => {
      if (key === 'fetch') {
        _.forEach(value, (fetch) => {
          buildComponents.push(fetch);
        });
      }
    });
  });
}

let _createApiData = function (fetchData) {
  _.forEach(fetchData, (fetch) => {
    console.log(fetch.format);
    _.forEach(fetch.apis, (api) => {
      console.log(api.api);
    });
  });
}
