const _ = require('lodash');
const chalk = require('chalk');
const gulp = require('gulp');
const FS = require('fs');
const USER_COMPONENT_JSON = 'seed/user-components';
const USER_COMPONENT_DIST = 'src/user-components';
const USER_PAGE_JSON = 'seed/user-pages';
const USER_PAGE_DIST = 'src/user-pages';

/**
 * Create User Components
 */
gulp.task('create-user-components', function (done) {
  _cleanDirectories(USER_COMPONENT_DIST);
  let userComponentsJSONFilePaths = _jsonFilePaths(USER_COMPONENT_JSON);
  console.log(userComponentsJSONFilePaths);
  if (userComponentsJSONFilePaths === null || userComponentsJSONFilePaths.length === 0) {
    console.log(chalk.black.bgGreen("  There is no user component...  "));
    done();
    return;
  }
  done();
});

/**
 * Create User Pages
 */
gulp.task('create-user-pages', function (done){
  _cleanDirectories(USER_PAGE_DIST);
  let userPagesJSONFilePaths = _jsonFilePaths(USER_PAGE_JSON);
  console.log(userPagesJSONFilePaths);
  if (userPagesJSONFilePaths === null || userPagesJSONFilePaths.length === 0) {
    console.log(chalk.black.bgGreen("  There is no user pages...  "));
    done();
    return;
  }
  done();
});

/**
 * gulp default task
 */
gulp.task('default',
  gulp.series(gulp.parallel(
    'create-user-components',
    'create-user-pages'
  ), function (done) {
    done();
  })
);

let _jsonFilePaths = function (dirPath) {
  let allFiles = FS.readdirSync(dirPath);
  if (allFiles && _.isArray(allFiles)) {
    let jsonFilePathList = allFiles.filter(function (filePath) {
      return FS.statSync(`${dirPath}/${filePath}`).isFile() && /.*\.json$/.test(filePath);
    });
    jsonFilePathList = jsonFilePathList.map(filePath => `${dirPath}/${filePath}`);
    return jsonFilePathList;
  }
  return null;
}

let _cleanDirectories = function (targetPath) {
  _deleteDirectoryRecursive(targetPath);
  FS.mkdirSync(targetPath, (err) =>{
    console.log(err);
  });
}

let _deleteDirectoryRecursive = function(path) {
  if(FS.existsSync(path)) {
    FS.readdirSync(path).forEach(function(file) {
      let curPath = path + "/" + file;
      if(FS.lstatSync(curPath).isDirectory()) { // recurse
        _deleteDirectoryRecursive(curPath);
      } else { // delete file
        FS.unlinkSync(curPath);
      }
    });
    FS.rmdirSync(path);
  }
};
