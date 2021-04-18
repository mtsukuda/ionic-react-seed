const gulp = require("gulp");
const gulpFs = require("../gulplib/gulpfs");
const gulpHeadLine = require("../gulplib/gulpheadline");
const MENU_SAMPLE_CONFIG_JSON = "../seed/app/menu.json.sample";
const MENU_CONFIG_JSON = "../seed/app/menu.json";
const SAMPLE_CONFIG_EXT = "json.sample";
const SAMPLE_CONFIG_JSON = "../seed/app-sample";
const PAGE_SAMPLE_CONFIG_JSON_DIST = "../seed/user-pages";
const PAGE_SAMPLE_CONFIG_JSON_NAME = "sample-page";
const COMPONENT_SAMPLE_CONFIG_JSON_DIST = "../seed/user-components";
const COMPONENT_SAMPLE_CONFIG_JSON_NAME = "sample-component";

/**
 * Copy Menu
 */
gulp.task("copy-menu", function (done) {
  gulpHeadLine.taskNameWrite("copy-menu");
  gulpFs.copyFile(MENU_SAMPLE_CONFIG_JSON, MENU_CONFIG_JSON);
  done();
});

/**
 * Copy Sample Pages
 */
gulp.task("copy-sample-pages", function (done) {
  gulpHeadLine.taskNameWrite("copy-sample-pages");
  let samplePages = [
    `${PAGE_SAMPLE_CONFIG_JSON_NAME}1`,
    `${PAGE_SAMPLE_CONFIG_JSON_NAME}2`,
  ];
  samplePages.forEach((samplePage) => {
    if (
      gulpFs.fileExists(
        `${SAMPLE_CONFIG_JSON}/${samplePage}.${SAMPLE_CONFIG_EXT}`
      ) === false
    ) {
      done(
        `Could not find ${SAMPLE_CONFIG_JSON}/${samplePage}.${SAMPLE_CONFIG_EXT}.`
      );
    }
  });
  samplePages.forEach((samplePage) => {
    gulpFs.copyFile(
      `${SAMPLE_CONFIG_JSON}/${samplePage}.${SAMPLE_CONFIG_EXT}`,
      `${PAGE_SAMPLE_CONFIG_JSON_DIST}/${samplePage}.json`
    );
  });
  done();
});

/**
 * Copy Sample Components
 */
gulp.task("copy-sample-components", function (done) {
  gulpHeadLine.taskNameWrite("copy-sample-components");
  let sampleComponents = [
    `${COMPONENT_SAMPLE_CONFIG_JSON_NAME}1`,
    `${COMPONENT_SAMPLE_CONFIG_JSON_NAME}2`,
  ];
  sampleComponents.forEach((sampleComponent) => {
    if (
      gulpFs.fileExists(
        `${SAMPLE_CONFIG_JSON}/${sampleComponent}.${SAMPLE_CONFIG_EXT}`
      ) === false
    ) {
      done(
        `Could not find ${SAMPLE_CONFIG_JSON}/${sampleComponent}.${SAMPLE_CONFIG_EXT}.`
      );
    }
  });
  sampleComponents.forEach((sampleComponent) => {
    gulpFs.copyFile(
      `${SAMPLE_CONFIG_JSON}/${sampleComponent}.${SAMPLE_CONFIG_EXT}`,
      `${COMPONENT_SAMPLE_CONFIG_JSON_DIST}/${sampleComponent}.json`
    );
  });
  done();
});

/**
 * gulp default task
 */
gulp.task(
  "default",
  gulp.series(
    gulp.parallel("copy-menu", "copy-sample-pages", "copy-sample-components"),
    function (done) {
      done();
    }
  )
);
