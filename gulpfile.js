const _ = require('lodash');
const gulp = require('gulp');
const FS = require('fs');
const USER_COMPONENT_DIST = 'src/user-components';

/**
 * Create User Components
 */
gulp.task('create-user-components', function (done) {
  _cleanDirectories(USER_COMPONENT_DIST);
  done();
});

/**
 * Create User Pages
 */
gulp.task('create-user-pages', function (done){
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
