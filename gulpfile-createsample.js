const gulp = require('gulp');
const FS = require('fs');
const chalk = require('chalk');
const MENU_SAMPLE_CONFIG_JSON = 'seed/app/menu.json.sample';
const MENU_CONFIG_JSON = 'seed/app/menu.json';

/**
 * Create Menu
 */
gulp.task('copy-menu', function (done){
  console.log(' 🚀🚀🚀 ' + chalk.bgBlue(' copy-menu ') + ' 🚀🚀🚀 ');
  if(FS.existsSync(MENU_CONFIG_JSON)) {
    done(`Already exist ${MENU_CONFIG_JSON}.`);
    return;
  }
  FS.copyFileSync(MENU_SAMPLE_CONFIG_JSON, MENU_CONFIG_JSON);
  done();
});

/**
 * gulp default task
 */
gulp.task('default',
  gulp.series(gulp.parallel(
    'copy-menu',
  ), function (done) {
    done();
  })
);
