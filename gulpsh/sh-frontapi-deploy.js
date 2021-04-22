const gulp = require("gulp");
const exec = require("exec-sh").promise;
const gulpFs = require("../gulplib/gulpfs");
const gulpWrite = require("../gulplib/gulpwrite");

/**
 * Front Api deploy
 */
gulp.task("front-api-deploy", async function (done) {
  gulpWrite.taskNameWrite("front-api-deploy");
  let packageJSON = gulpFs.JSONdata("../package.json", false);
  let apiPath = `../../${packageJSON.name}-api`;
  let out;
  try {
    out = await exec(`yarn --cwd ${apiPath} sls deploy`, true);
  } catch (e) {
    console.log("Error: ", e);
    console.log("Stderr: ", e.stderr);
    console.log("Stdout: ", e.stdout);
    return e;
  }
  console.log(out);
  done();
});

/**
 * gulp default task
 */
gulp.task(
  "default",
  gulp.series(gulp.parallel("front-api-deploy"), function (done) {
    done();
  })
);
