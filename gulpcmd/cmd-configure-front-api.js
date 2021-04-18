const _ = require("lodash");
const gulp = require("gulp");
const chalk = require("chalk");
const gulpFs = require("../gulplib/gulpfs");
const gulpConst = require("../gulplib/gulpconst");
const gulpLog = require("../gulplib/gulplog");
const gulpHeadLine = require("./gulplib/gulpheadline");
const pullEndPoint = require("../gulpcmd/cmd-pull-endpoint");
const USER_PAGE_JSON = "../seed/user-pages";
const USER_COMPONENT_JSON = "../seed/user-components";
const FRONT_API_FUNCTIONS_CONFIG = "seed/functions/config.json";

/**
 * Configure Front API
 */
gulp.task("configure-front-api", function (done) {
  gulpHeadLine.taskNameWrite("configure-front-api");
  let projectPath = _frontApiProjectPath();
  if (projectPath === false) {
    throw new Error("Could not find API project file.");
  }
  let userPagesJSONFilePaths = gulpFs.jsonFilePaths(USER_PAGE_JSON);
  let fetchData = [];
  if (userPagesJSONFilePaths !== null && userPagesJSONFilePaths.length > 0) {
    _extractFetchData(userPagesJSONFilePaths, fetchData);
  }
  let userComponentsJSONFilePaths = gulpFs.jsonFilePaths(USER_COMPONENT_JSON);
  if (
    userComponentsJSONFilePaths !== null &&
    userComponentsJSONFilePaths.length > 0
  ) {
    _extractFetchData(userComponentsJSONFilePaths, fetchData);
  }
  let functionJSON = { functions: [] };
  _createApiData(fetchData, functionJSON);
  _configureLog(functionJSON);
  let frontApiFunctionsPath = `${projectPath}/${FRONT_API_FUNCTIONS_CONFIG}`;
  gulpFs.writeDistFile(
    frontApiFunctionsPath,
    JSON.stringify(functionJSON, null, 2)
  );
  done();
});

/**
 * Verify Front API Response Type
 */
gulp.task("verify-front-api-response-type", function (done) {
  gulpHeadLine.taskNameWrite("verify-front-api-response-type");
  let userPagesJSONFilePaths = gulpFs.jsonFilePaths(USER_PAGE_JSON);
  let fetchData = [];
  if (userPagesJSONFilePaths !== null && userPagesJSONFilePaths.length > 0) {
    _extractFetchData(userPagesJSONFilePaths, fetchData);
  }
  let userComponentsJSONFilePaths = gulpFs.jsonFilePaths(USER_COMPONENT_JSON);
  if (
    userComponentsJSONFilePaths !== null &&
    userComponentsJSONFilePaths.length > 0
  ) {
    _extractFetchData(userComponentsJSONFilePaths, fetchData);
  }
  _compareResponseType(fetchData);
  done();
});

/**
 * gulp default task
 */
gulp.task(
  "default",
  gulp.series(gulp.parallel("configure-front-api"), function (done) {
    done();
  })
);

let _frontApiProjectPath = function () {
  let frontApiConfigJsonPath = `../${pullEndPoint.frontApiConfigJsonPath()}`;
  if (gulpFs.fileExists(frontApiConfigJsonPath) === false) {
    return false;
  }
  let frontApiConfigJson = JSON.parse(
    gulpFs.readWholeFile(frontApiConfigJsonPath)
  );
  if (!frontApiConfigJson) {
    return false;
  }
  return frontApiConfigJson.FrontApiProjectPath;
};

let _extractFetchData = function (componentConfigJSONFilePaths, fetchData) {
  _.forEach(componentConfigJSONFilePaths, (componentConfigJSONFilePath) => {
    let componentConfigJSON = gulpFs.JSONdata(
      componentConfigJSONFilePath,
      false
    );
    _.forEach(componentConfigJSON, (value, key) => {
      if (key === "fetch") {
        _.forEach(value, (fetch) => {
          fetchData.push(fetch);
        });
      }
    });
  });
};

let _createApiData = function (fetchData, functionJSON) {
  _.forEach(fetchData, (fetch) => {
    _.forEach(fetch.apis, (api) => {
      if (gulpConst.slsFrontApiUri() === api.uri) {
        if (api.config.path === undefined)
          throw new Error("Could not find 'api.config.path'!");
        let functionConfig = { method: fetch.method, path: api.config.path };
        if (api.config.mock) {
          functionConfig["mock"] = api.config.mock;
        }
        if (api.config.schema) {
          functionConfig["schema"] = api.config.schema;
        }
        functionJSON.functions.push(functionConfig);
      }
    });
  });
};

let _compareResponseType = function (fetchData) {
  _.forEach(fetchData, (fetch) => {
    _.forEach(fetch.apis, (api) => {
      if (!api.responseTypeStrict) return;
      if (api.responseTypeStrict === false) return;
      if (!api.config || !api.config.mock) return;
      let responseType = api.responseType;
      let mockData = api.config.mock;
      let flatArrayResponseType = [];
      let flatArrayMockData = [];
      _extractArrayKeys(responseType, flatArrayResponseType);
      _extractArrayKeys(mockData, flatArrayMockData);
      flatArrayResponseType.sort();
      flatArrayMockData.sort();
      if (_.isEqual(flatArrayResponseType, flatArrayMockData) === false) {
        throw new Error(
          `Could not mach between response type and mock data: ${api.responseTypeName}`
        );
      }
      console.log(chalk.greenBright(`✓ `) + `${api.responseTypeName}`);
    });
  });
  return true;
};

let _extractArrayKeys = function (responseType, flatArray, parentKey = "") {
  _.forEach(responseType, (value, key) => {
    if (_.isObject(value)) {
      _extractArrayKeys(
        value,
        flatArray,
        (parentKey ? `${parentKey}-` : "") + key
      );
    }
    flatArray.push((parentKey ? `${parentKey}-` : "") + key);
  });
};

let _configureLog = function (functionJSON) {
  console.log(chalk.green(`functions: `));
  functionJSON.functions.forEach((func) => {
    let log =
      `${gulpLog.logKeyVal("path", func.path)} ` +
      `${gulpLog.logKeyVal("method", func.method)} ` +
      `${gulpLog.logKeyValYesNo("mock", func.mock)} ` +
      `${gulpLog.logKeyValYesNo("schema", func.schema)} `;
    console.log("  " + log);
  });
};
