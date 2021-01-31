const _ = require('lodash');
const chalk = require('chalk');
const gulp = require('gulp');
const FS = require('fs');
const USER_COMPONENT_JSON = 'seed/user-components';
const USER_COMPONENT_TEMPLATE_FILE_PATH = 'seed/user-components-templates/user-component-basic.js.tpl';
const USER_COMPONENT_DIST = 'src/user-components';
const USER_PAGE_JSON = 'seed/user-pages';
const USER_PAGE_TEMPLATE_FILE_PATH = 'seed/user-pages-templates/user-page-basic.js.tpl'
const USER_PAGE_DIST = 'src/user-pages';
const APP_TEMPLATE_PATH = 'seed/apps/App.tsx.tpl';
const APP_DIST_PATH = 'src/App.tsx';

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
  let userComponents = [];
  _componentBuild(userComponentsJSONFilePaths, userComponents);
  _createUserComponentFile(userComponents);
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
  let userPages = [];
  _componentBuild(userPagesJSONFilePaths, userPages);
  _createUserPageFile(userPages);
  done();
});

/**
 * Create App script
 */
gulp.task('create-app-script', function (done){
  let appTemplateFileBuffer = _readWholeFile(APP_TEMPLATE_PATH);
  _writeDistFile(APP_DIST_PATH, appTemplateFileBuffer);
  done();
});

/**
 * gulp default task
 */
gulp.task('default',
  gulp.series(gulp.parallel(
    'create-user-components',
    'create-user-pages',
    'create-app-script'
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

let _writeDistFile = function (distFilePath, buffer) {
  try {
    FS.writeFileSync(distFilePath, buffer);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
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

let _componentName = function (component) {
  return component.charAt(0).toUpperCase() + _.camelCase(component).slice(1);
};

let _JSONdata = function (filePath) {
  let fileBuffer = _readWholeFile(filePath);
  if (fileBuffer === null) return '';
  let jsonData = JSON.parse(fileBuffer);
  console.log(jsonData);
  return jsonData;
};

let _readWholeFile = function (targetPath) {
  try {
    return FS.readFileSync(targetPath, 'utf8');
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log(`Could not find: "${targetPath}"`);
      return null;
    }
    console.log(err);
    return null;
  }
};

let _componentBuild = function (componentConfigJSONFilePaths, buildComponents) {
  _.forEach(componentConfigJSONFilePaths, (componentConfigJSONFilePath) => {
    let componentConfigJSON = _JSONdata(componentConfigJSONFilePath);
    let componentName = _componentName(componentConfigJSON.name);
    let tags = [];
    _htmlTagRecursive(componentConfigJSON, tags);
    let componentMethods = [];
    _componentMethodRecursiveWithOverlapCheck(componentConfigJSON, componentMethods);
    let userComponentSet = {};
    userComponentSet['name'] = componentName;
    userComponentSet['html'] = _tagToHtml(tags);
    userComponentSet['import'] = componentConfigJSON.import;
    userComponentSet['methods'] = componentMethods;
    userComponentSet['fetch'] = componentConfigJSON.fetch;
    userComponentSet['lifeCycleMethods'] = componentConfigJSON.lifeCycleMethods;
    userComponentSet['renderBeforeReturn'] = componentConfigJSON.renderBeforeReturn;
    userComponentSet['defaultProps'] = componentConfigJSON.defaultProps;
    buildComponents.push(userComponentSet);
  });
}

let _htmlTagRecursive = function (sauceJSON, tags, closeTag, type) {
  if (_.isUndefined(sauceJSON.tags) === false) {
    _.forEach(sauceJSON.tags, (component) => {
      let openTagSet = {"open": component.tag, "props": _componentProperties(component)};
      let closeTag = component.tag;
      if (_.isUndefined(component.type) === false) openTagSet['type'] = component.type;
      if (_.isUndefined(component.close) === false) closeTag = component.close;
      if (_.isUndefined(component.content) === false) openTagSet['content'] = component.content;
      if (_.isUndefined(component.rawContent) === false) openTagSet['rawContent'] = component.rawContent;
      if (_.isUndefined(component.single) === false) openTagSet['single'] = component.single;
      tags.push(openTagSet);
      if (_.isUndefined(component.child) === false) {
        _htmlTagRecursive(component.child, tags, closeTag, component.type);
      } else if (_.isUndefined(component.single) === true) {
        let closeTagSet = {};
        if (_.isUndefined(component.type) === false) closeTagSet['type'] = component.type;
        if (_.isUndefined(component.tag) === false) closeTagSet['close'] = _.isUndefined(component.close) === false ? component.close : component.tag;
        if (_.isUndefined(component.noCR) === false) closeTagSet['noCR'] = component.noCR;
        if (_.isUndefined(component.contentAT) === false) closeTagSet['contentAfterTag'] = component.contentAT;
        if (_.isUndefined(component.rawContent) === false) closeTagSet['rawContent'] = component.rawContent;
        if (_.isEmpty(closeTagSet) === false) tags.push(closeTagSet);
      }
    });
    let closeTagSet = {};
    if (_.isUndefined(closeTag) === false) closeTagSet['close'] = closeTag;
    if (_.isUndefined(type) === false) closeTagSet['type'] = type;
    if (_.isEmpty(closeTagSet) === false) tags.push(closeTagSet);
  }
}

let _componentProperties = function (component) {
  let functionName = '_componentProperties()';
  if (_isSet(component, 'props', functionName) === false) return '';
  let props = '';
  _.forEach(component.props, (prop) => {
    props += ' ' + prop;
  });
  return props;
}

let _isSet = function (targetObject, propertyName, methodName, enableThrow=false) {
  if (_.isUndefined(targetObject[propertyName])) {
    let log = `There is no ${propertyName} object: ${methodName}`;
    if (enableThrow) throw log;
    // console.log(log);
    return false;
  }
  return true;
}

let _distFilePath = function (templateFilePath){
  let resultPath = templateFilePath.replace('seed', 'src');
  resultPath = resultPath.replace('.tpl', '');
  // console.log(resultPath);
  return resultPath;
}

let _componentMethodRecursiveWithOverlapCheck = function (sauceJSON, componentMethods) {
  if (_.isUndefined(sauceJSON.tags) === false) {
    _.forEach(sauceJSON.tags, (component) => {
      if (_.isUndefined(component.componentMethod) === false) {
        _.forEach(componentMethods, (existComponentMethod) => {
          _.forEach(existComponentMethod.states, (overlapCheckComponentStat) => {
            if (_.find(component.componentMethod.states, (v) => { return v.name === overlapCheckComponentStat.name})) {
              throw "Duplicate component function status name!";
            }
          });
          _.forEach(existComponentMethod.methods, (overlapCheckComponentMethod) => {
            if (_.find(component.componentMethod.methods, (v) => { return v.name === overlapCheckComponentMethod.name})) {
              throw "Duplicate component function name!";
            }
          });
        });
        componentMethods.push(component.componentMethod);
      }
      if (_.isUndefined(component.child) === false) {
        _componentMethodRecursiveWithOverlapCheck(component.child, componentMethods);
      }
    });
  }
}

let _tagToHtml = function (tags) {
  let result = '';
  let beforeTag = "none";
  let isBeforeSingle = undefined;
  _.forEach(tags, (tag, i) => {
    if (tag.open && _.isUndefined(isBeforeSingle)) {
      beforeTag = "open";
    }
    if (tag.close) {
      beforeTag = "close";
    }
    let cr = (i > 0 ? '\n' : '');
    let space = _.isUndefined(tag.noCR) ? cr : '';
    result += space + (tag.type === "raw" ? _rawTag(tag) : _htmlTag(tag));
    isBeforeSingle = tag.single;
  });
  return result;
}

let _rawTag = function (tag) {
  let result = '';
  if (tag.open) {
    result = `${tag.open}`;
  } else if (tag.close) {
    result = `${tag.close}`;
  }
  return result;
}

let _htmlTag = function (tag) {
  let result = '';
  if (tag.open) {
    result = `<${tag.open}${tag.props}${(tag.single?' /':'')}>` + (tag.content?tag.content:'');
  } else if (tag.close) {
    result = (tag.single?'':`</${tag.close}>`) + (tag.contentAfterTag?tag.contentAfterTag:'');
  }
  return result;
}

let _typePackage = function (component) {
  if (_.isUndefined(component.type) === false && component.type.toLowerCase() === "package") {
    return true;
  }
  return false;
}

let _typeDefault = function (component) {
  if (_.isUndefined(component.type) === false && component.type.toLowerCase() === "default") {
    return true;
  }
  return false;
}

let _typeCss = function (component) {
  if (_.isUndefined(component.type) === false && component.type.toLowerCase() === "css") {
    return true;
  }
  return false;
}

let _dedupeImportComponents = function (component, userPageImportComponents) {
  if (_typePackage(component) === false) return;
  if (_.isUndefined(userPageImportComponents[component.from])) {
    let componentName = [];
    componentName.push(component.name);
    userPageImportComponents[component.from] = componentName;
  } else {
    let existGroupComponents = userPageImportComponents[component.from];
    if (_.isUndefined(existGroupComponents[component.name])) existGroupComponents.push(component.name);
    userPageImportComponents[component.from] = existGroupComponents;
  }
}

let _dedupeDefaultImportComponents = function (component, userPageDefaultImportComponents) {
  if (_typeDefault(component) === false) return;
  // if (_.isUndefined(component.type) || component.type !== "default") return;
  let importSet = { name: component.name, from: component.from };
  if (_.find(userPageDefaultImportComponents, (v) => { return (v.name === component.name) })) {
    console.log(`Duplicate component: ${component.name}`);
    return;
  }
  userPageDefaultImportComponents.push(importSet);
}

let _dedupeImportCss = function (component, userImportCss) {
  if (_typeCss(component) === false) return;
  let importSet = { name: component.name };
  if (_.find(userImportCss, (v) => { return (v.name === component.name) })) {
    console.log(`Duplicate css: ${component.name}`);
    return;
  }
  userImportCss.push(importSet);
}

let _importComponentDeclaration = function (userPageImportComponents) {
  let result = '';
  for(let importFrom in userPageImportComponents) {
    if(!userPageImportComponents.hasOwnProperty(importFrom)) continue;
    let components = userPageImportComponents[importFrom];
    let commaSeparatedComponents = '';
    _.forEach(components, (component) => {
      commaSeparatedComponents += (commaSeparatedComponents ? ' ,' : '') + component;
    });
    result += (result ? '\n' : '') + 'import { ' + commaSeparatedComponents + ' } from "' + importFrom + '";';
  }
  // console.log(result);
  return result;
}

let _importDefaultImportComponentDeclaration = function (userPageDefaultImportComponents) {
  let result = '';
  _.forEach(userPageDefaultImportComponents, declaration => {
    result += (result ? '\n' : '') + 'import ' + declaration.name + ' from "' + declaration.from + '";';
  });
  return result;
}

let _importImportCssDeclaration = function (userPageDefaultImportComponents) {
  let result = '';
  _.forEach(userPageDefaultImportComponents, declaration => {
    result += (result ? '\n' : '') + 'import ' + declaration.name;
  });
  return result;
}

let _createUserComponentFile = function (userComponents, prefix='') {
  _createComponentFile(userComponents, USER_COMPONENT_TEMPLATE_FILE_PATH, USER_COMPONENT_DIST, prefix);
}

let _createUserPageFile = function (userComponents, prefix='') {
  _createComponentFile(userComponents, USER_PAGE_TEMPLATE_FILE_PATH, USER_PAGE_DIST, prefix);
}

let _createComponentFile = function (targetComponents, templateFilePath, componentDist, prefix='') {
  let orgFileBuffer = _readWholeFile(templateFilePath);
  targetComponents.forEach((componentSet) => {
    let componentFilePath = componentDist + '/' + componentSet.name + '.tsx';
    let fileBuffer = _replaceTag('COMOPNENT_NAME', componentSet.name, orgFileBuffer);
    fileBuffer = _replaceTag('RENDER_HTML', componentSet.html, fileBuffer);
    let importComponents = [], defaultImportComponents = [], importCss = [];
    _.forEach(componentSet.import, (component) => {
      _dedupeImportComponents(component, importComponents);
      _dedupeDefaultImportComponents(component, defaultImportComponents);
      _dedupeImportCss(component, importCss);
    });
    let userComponentImportDeclaration = _importComponentDeclaration(importComponents);
    fileBuffer = _replaceTag('IMPORT_COMPONENTS', userComponentImportDeclaration, fileBuffer);
    let userComopnentDefaultImportDeclaration = _importDefaultImportComponentDeclaration(defaultImportComponents);
    fileBuffer = _replaceTag('DEFAULT_IMPORT_COMPONENTS', userComopnentDefaultImportDeclaration, fileBuffer);
    let userImportCssDeclaration = _importImportCssDeclaration(importCss);
    fileBuffer = _replaceTag('IMPORT_CSS', userImportCssDeclaration, fileBuffer);
    _writeDistFile(_distFilePath(componentFilePath), fileBuffer);
  });
}

let _replaceTag = function (tagString, replaceString, buffer, startWith='') {
  tagString = new RegExp(startWith + '<!--@@' + tagString + '-->','g');
  console.log('REPLACE: ' + tagString + ' ==> ' + replaceString);
  // console.log(buffer);
  return buffer.replace(tagString, replaceString);
};
