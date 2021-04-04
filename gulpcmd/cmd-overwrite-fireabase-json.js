const gulp = require('gulp');
const chalk = require('chalk');
const gulpfs = require('../gulplib/gulpfs');
const FIREBASE_JSON = 'firebase.json';

/**
 * Overwrite Firebase JSON File
 */
gulp.task('overwrite-firebase-json', async function (done){
  console.log(' 🚀🚀🚀 ' + chalk.bgBlue(' overwrite-firebase-json ') + ' 🚀🚀🚀 ');
  let packageJSON = gulpfs.JSONdata(`../seed/config/${FIREBASE_JSON}`, false);
  gulpfs.writeDistFile(`../${FIREBASE_JSON}`, JSON.stringify(packageJSON, null, 2));
  done();
});

/**
 * gulp default task
 */
gulp.task('default',
  gulp.series(gulp.parallel(
    'overwrite-firebase-json',
  ), function (done) {
    done();
  })
);
