const gulp = require("gulp");
const gulpFs = require("../gulplib/gulpfs");
const gulpHeadLine = require("../gulplib/gulpheadline");
const FRONT_API_CONFIG_JSON_PATH = "../seed/app/front-api-config.json";
const SLS_STACK_JSON_PATH = ".serverless/stack.json";

/**
 * Pull Front API Endpoint
 */
gulp.task("pull-endpoint", function (done) {
  gulpHeadLine.taskNameWrite("pull-endpoint");
  _checkFrontApiConfigPath();
  done();
});

/**
 * gulp default task
 */
gulp.task(
  "default",
  gulp.series(gulp.parallel("pull-endpoint"), function (done) {
    done();
  })
);

let _checkFrontApiConfigPath = function () {
  if (gulpFs.fileExists(FRONT_API_CONFIG_JSON_PATH) === false) {
    module.exports.createDefaultFrontApiConfigJson();
  }
  let frontApiConfig = JSON.parse(
    gulpFs.readWholeFile(FRONT_API_CONFIG_JSON_PATH)
  );
  if (frontApiConfig.FrontApiProjectPath) {
    if (
      gulpFs.fileExists(
        `${frontApiConfig.FrontApiProjectPath}/${SLS_STACK_JSON_PATH}`
      ) === false
    ) {
      throw new Error(
        `Could not find SLS stack -> ${frontApiConfig.FrontApiProjectPath}/${SLS_STACK_JSON_PATH}`
      );
    }
    let slsStackJSON = JSON.parse(
      gulpFs.readWholeFile(
        `${frontApiConfig.FrontApiProjectPath}/${SLS_STACK_JSON_PATH}`
      )
    );
    if (!slsStackJSON.ServiceEndpoint) {
      throw new Error("Require ServiceEndpoint in stack file");
    }
    frontApiConfig["FrontApiEndPoint"] = slsStackJSON.ServiceEndpoint;
    gulpFs.writeDistFile(
      FRONT_API_CONFIG_JSON_PATH,
      JSON.stringify(frontApiConfig, null, 2)
    );
  } else {
    throw new Error(`Require SLS path -> ${FRONT_API_CONFIG_JSON_PATH}`);
  }
};

let createDefaultFrontApiPath = () => {
  let dirArray = __dirname.split("/");
  dirArray.pop();
  let defaultFrontApiPath = dirArray.join("/") + "-api";
  console.log(`default front API: ${defaultFrontApiPath}`);
  return defaultFrontApiPath;
};

module.exports.createDefaultFrontApiConfigJson = () => {
  if (gulpFs.fileExists(FRONT_API_CONFIG_JSON_PATH))
    throw new Error(`Front API config is exist! ${FRONT_API_CONFIG_JSON_PATH}`);
  let frontApiConfig = {
    FrontApiProjectPath: createDefaultFrontApiPath(),
    FrontApiEndPoint: "",
  };
  gulpFs.writeDistFile(
    FRONT_API_CONFIG_JSON_PATH,
    JSON.stringify(frontApiConfig, null, 2)
  );
};

module.exports.frontApiConfigJsonPath = () => {
  return FRONT_API_CONFIG_JSON_PATH.replace("../", "");
};
