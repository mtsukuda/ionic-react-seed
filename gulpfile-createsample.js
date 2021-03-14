const gulp = require('gulp');
const FS = require('fs');
const chalk = require('chalk');
const MENU_SAMPLE_CONFIG_JSON = 'seed/app/menu.json.sample';
const MENU_CONFIG_JSON = 'seed/app/menu.json';
const PAGE_SAMPLE_CONFIG_JSON = 'seed/user-pages/sample-page';
const COMPONENT_SAMPLE_CONFIG_JSON = 'seed/user-components/sample-component';

/**
 * Copy Menu
 */
gulp.task('copy-menu', function (done){
  console.log(' 🚀🚀🚀 ' + chalk.bgBlue(' copy-menu ') + ' 🚀🚀🚀 ');
  // if(FS.existsSync(MENU_CONFIG_JSON)) {
  //   done(`Already exist ${MENU_CONFIG_JSON}.`);
  //   return;
  // }
  FS.copyFileSync(MENU_SAMPLE_CONFIG_JSON, MENU_CONFIG_JSON);
  done();
});

/**
 * Copy Sample Pages
 */
gulp.task('copy-sample-pages', function (done){
  console.log(' 🚀🚀🚀 ' + chalk.bgBlue(' copy-menu ') + ' 🚀🚀🚀 ');
  let samplePages = [
    `${PAGE_SAMPLE_CONFIG_JSON}1`,
    `${PAGE_SAMPLE_CONFIG_JSON}2`
  ];
  const jsonSampleExt = 'json.sample';
  samplePages.forEach((samplePage) => {
    if(FS.existsSync(`${samplePage}.${jsonSampleExt}`) === false) {
      done(`Could not find ${samplePage}.${jsonSampleExt}.`);
    }
  });
  // samplePages.forEach((samplePage) => {
  //   if(FS.existsSync(`${samplePage}.json`)) {
  //     done(`Already exist ${samplePage}.json.`);
  //   }
  // });
  samplePages.forEach((samplePage) => {
    FS.copyFileSync(`${samplePage}.${jsonSampleExt}`, `${samplePage}.json`);
  });
  done();
});


/**
 * Copy Sample Components
 */
gulp.task('copy-sample-components', function (done){
  console.log(' 🚀🚀🚀 ' + chalk.bgBlue(' copy-menu ') + ' 🚀🚀🚀 ');
  let sampleComponents = [
    `${COMPONENT_SAMPLE_CONFIG_JSON}1`,
    `${COMPONENT_SAMPLE_CONFIG_JSON}2`
  ];
  const jsonSampleExt = 'json.sample';
  sampleComponents.forEach((sampleComponent) => {
    if(FS.existsSync(`${sampleComponent}.${jsonSampleExt}`) === false) {
      done(`Could not find ${sampleComponent}.${jsonSampleExt}.`);
    }
  });
  // sampleComponents.forEach((sampleComponent) => {
  //   if(FS.existsSync(`${sampleComponent}.json`)) {
  //     done(`Already exist ${sampleComponent}.json.`);
  //   }
  // });
  sampleComponents.forEach((sampleComponent) => {
    FS.copyFileSync(`${sampleComponent}.${jsonSampleExt}`, `${sampleComponent}.json`);
  });
  done();
});

/**
 * gulp default task
 */
gulp.task('default',
  gulp.series(gulp.parallel(
    'copy-menu',
    'copy-sample-pages',
    'copy-sample-components',
  ), function (done) {
    done();
  })
);
