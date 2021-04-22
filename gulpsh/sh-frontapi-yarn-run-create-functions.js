const gulp = require("gulp");
const exec = require("exec-sh").promise;
const gulpFs = require("../gulplib/gulpfs");
const gulpWrite = require("../gulplib/gulpwrite");
const FRONT_API_CONFIG_JSON_PATH = "../seed/app/front-api-config.json";

/**
 * Front Api yarn: run create-functions
 */
gulp.task("front-api-yarn-run-create-functions", async function (done) {
  gulpWrite.taskNameWrite("front-api-yarn-run-create-functions");
  if (gulpFs.fileExists(FRONT_API_CONFIG_JSON_PATH) === false) {
    throw new Error(
      `Could not find api config json: ${FRONT_API_CONFIG_JSON_PATH}.`
    );
  }
  let frontApiConfig = JSON.parse(
    gulpFs.readWholeFile(FRONT_API_CONFIG_JSON_PATH)
  );
  if (!frontApiConfig.FrontApiProjectPath) {
    throw new Error(
      `Could not find the entory of FrontApiProjectPath from api config json.`
    );
  }
  console.log(frontApiConfig.FrontApiProjectPath);
  let out;
  try {
    out = await exec(
      `yarn --cwd ${frontApiConfig.FrontApiProjectPath} run create-functions`,
      true
    );
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
  gulp.series(
    gulp.parallel("front-api-yarn-run-create-functions"),
    function (done) {
      done();
    }
  )
);
