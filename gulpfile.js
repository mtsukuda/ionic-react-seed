const _ = require('lodash');
const chalk = require('chalk');
const gulp = require('gulp');
const FS = require('fs');
const path = require('path');
const USER_COMMON_TEMPLATE = 'seed/user-common-templates';
const USER_COMPONENT_JSON = 'seed/user-components';
const USER_COMPONENT_TEMPLATE_FILE_PATH = 'seed/user-components-templates/user-component-basic.js.tpl';
const USER_COMPONENT_OWN_CSS = 'seed/user-components-css';
const USER_COMPONENT_METHOD = 'seed/user-component-method';
const USER_COMPONENT_DIST = 'src/user-components';
const USER_PAGE_JSON = 'seed/user-pages';
const USER_PAGE_TEMPLATE_FILE_PATH = 'seed/user-pages-templates/user-page-basic.js.tpl'
const USER_PAGE_OWN_CSS = 'seed/user-pages-css';
const USER_PAGE_DIST = 'src/user-pages';
const APP_TEMPLATE_PATH = 'seed/app-templates/App.tsx.tpl';
const APP_DIST = 'src/';
const MENU_CONFIG_JSON = 'seed/app/menu.json';
const MENU_TEMPLATE_PATH = 'seed/app-templates/Menu.tsx.tpl';
const APP_CSS_DIR = 'seed/app-css/';
const APP_COMPONENTS_DIST = 'src/components/';
const TEMP_DIR = ".temp";
const TEMP_EXT_STATE_INIT = "state-init";
const TEMP_EXT_STATE_INTERFACE = "state-interface";
const TEMP_EXT_TYPE = "type";

/**
 * Create User Components
 */
gulp.task('create-user-components', function (done) {
  console.log(' 🚀🚀🚀 ' + chalk.bgRed(' create-user-components ') + ' 🚀🚀🚀 ');
  _cleanDirectories(TEMP_DIR);
  _cleanDirectories(USER_COMPONENT_DIST);
  let userComponentsJSONFilePaths = _jsonFilePaths(USER_COMPONENT_JSON);
  console.log(userComponentsJSONFilePaths);
  if (userComponentsJSONFilePaths === null || userComponentsJSONFilePaths.length === 0) {
    console.log(chalk.black.bgGreen("  There is no user component...  "));
    done();
    return;
  }
  let userComponents = [];
  _componentBuild(userComponentsJSONFilePaths, USER_COMPONENT_OWN_CSS, USER_COMPONENT_DIST, userComponents);
  _createUserComponentFile(userComponents);
  done();
});

/**
 * Create User Pages
 */
gulp.task('create-user-pages', function (done){
  console.log(' 🚀🚀🚀 ' + chalk.bgRed(' create-user-pages ') + ' 🚀🚀🚀 ');
  _cleanDirectories(USER_PAGE_DIST);
  let userPagesJSONFilePaths = _jsonFilePaths(USER_PAGE_JSON);
  console.log(userPagesJSONFilePaths);
  if (userPagesJSONFilePaths === null || userPagesJSONFilePaths.length === 0) {
    console.log(chalk.black.bgGreen("  There is no user pages...  "));
    done();
    return;
  }
  let userPages = [];
  _componentBuild(userPagesJSONFilePaths, USER_PAGE_OWN_CSS, USER_PAGE_DIST, userPages);
  _createUserPageFile(userPages);
  done();
});

/**
 * Create App
 */
gulp.task('create-app', function (done){
  console.log(' 🚀🚀🚀 ' + chalk.bgRed(' create-app ') + ' 🚀🚀🚀 ');
  const target = 'App';
  if(FS.existsSync(MENU_CONFIG_JSON) === false) {
    done();
    return;
  }
  let menuConfigJSON = _JSONdata(MENU_CONFIG_JSON);
  let routeInfo = [];
  let redirect = '';
  _.forEach(menuConfigJSON.menu, (menu) => {
    let route = [];
    route['url'] = menu.strUrl;
    route['component'] = menu.component;
    if (menu.redirect && menu.redirect === "yes") {
      redirect = menu.strUrl;
    }
    routeInfo.push(route);
  });
  if (redirect === '') {
    redirect = routeInfo[0].url;
  }
  console.log(routeInfo);
  let appTemplateFileBuffer = _readWholeFile(APP_TEMPLATE_PATH);
  let importPages = _importPages(routeInfo);
  appTemplateFileBuffer = _replaceTag('IMPORT_PAGES', importPages, appTemplateFileBuffer);
  let routeTags = _routeTags(routeInfo, redirect);
  appTemplateFileBuffer = _replaceTag('ROUTER', routeTags, appTemplateFileBuffer);
  _writeDistFile(`${APP_DIST}${target}.tsx`, appTemplateFileBuffer);
  done();
});

/**
 * Create Menu
 */
gulp.task('create-menu', function (done){
  console.log(' 🚀🚀🚀 ' + chalk.bgRed(' create-menu ') + ' 🚀🚀🚀 ');
  const target = 'Menu';
  if(FS.existsSync(MENU_TEMPLATE_PATH) === false || FS.existsSync(MENU_CONFIG_JSON) === false) {
    FS.unlinkSync(`${APP_COMPONENTS_DIST}${target}.tsx`);
    FS.unlinkSync(`${APP_COMPONENTS_DIST}${target}.css`);
    done();
    return;
  }
  let menuConfigJSON = _JSONdata(MENU_CONFIG_JSON);
  let buildMenu = [];
  let menuIcons = [];
  _.forEach(menuConfigJSON.menu, (menu) => {
    menu['iosIcon'] = menu.icon + "Outline";
    menu['mdIcon'] = menu.icon + "Sharp";
    buildMenu.push(menu);
    menuIcons.push(menu.iosIcon);
    menuIcons.push(menu.mdIcon);
    delete menu.icon;
    delete menu.component;
    delete menu.redirect;
    _.forEach(menu, (value, key) => {
      if (key.slice(0, 'str'.length) === 'str') {
        menu[key] = `'${value}'`;
      }
    });
  });
  let menuTemplateFileBuffer = _readWholeFile(MENU_TEMPLATE_PATH);
  let menuHeaderTitle = (menuConfigJSON.header && menuConfigJSON.header.strTitle) ? menuConfigJSON.header.strTitle : 'Ionic Seed App';
  menuTemplateFileBuffer = _replaceTag('APP_HEADER', menuHeaderTitle, menuTemplateFileBuffer);
  let signOutCaption = (menuConfigJSON.signOut && menuConfigJSON.signOut.strCaption) ? menuConfigJSON.signOut.strCaption : 'Sign Out';
  menuTemplateFileBuffer = _replaceTag('APP_MENU_SIGNOUT', signOutCaption, menuTemplateFileBuffer);
  menuTemplateFileBuffer = _replaceTag('APP_MENU', JSON.stringify(buildMenu).replace(/\"/g, ''), menuTemplateFileBuffer);
  menuTemplateFileBuffer = _replaceTag('APP_MENU_ICONS', menuIcons.join(',') + ',', menuTemplateFileBuffer);
  let menuBottomParameters = (menuConfigJSON.menuBottom && menuConfigJSON.menuBottom.parameters ? menuConfigJSON.menuBottom.parameters.join('\n'):'');
  menuTemplateFileBuffer = _replaceTag('APP_MENU_BOTTOM_PARAMETER', menuBottomParameters, menuTemplateFileBuffer);
  let tags = [];
  if (menuConfigJSON.menuBottom) _htmlTagRecursive(menuConfigJSON.menuBottom, tags);
  menuTemplateFileBuffer = _replaceTag('APP_MENU_BOTTOM', _tagToHtml(tags), menuTemplateFileBuffer);
  _writeDistFile(`${APP_COMPONENTS_DIST}${target}.tsx`, menuTemplateFileBuffer);
  let menuCssFileBuffer = _readWholeFile(`${APP_CSS_DIR}${target}.css`);
  _writeDistFile(`${APP_COMPONENTS_DIST}${target}.css`, menuCssFileBuffer);
  done();
});

/**
 * gulp default task
 */
gulp.task('default',
  gulp.series(gulp.parallel(
    'create-user-components',
    'create-user-pages',
    'create-app',
    'create-menu'
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

let _appendDistFile = function (distFilePath, buffer) {
  try {
    FS.appendFileSync(distFilePath, buffer);
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

let _appendTemp = function (name, ext, buffer) {
  let tempStateFilePath = `${TEMP_DIR}/${name}.${ext}`;
  _appendDistFile(tempStateFilePath, buffer);
}

let _readTemp = function (name, ext) {
  let tempStateFilePath = `${TEMP_DIR}/${name}.${ext}`;
  if(FS.existsSync(tempStateFilePath) === false) {
    return ''
  }
  let tempBuffer = _readWholeFile(tempStateFilePath);
  return tempBuffer;
}

let _componentBuild = function (componentConfigJSONFilePaths, cssSeedDirectory, cssDist, buildComponents) {
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
    userComponentSet['ownCss'] = _ownCss(cssSeedDirectory, cssDist, path.basename(componentConfigJSONFilePath).replace("json", "css"), componentName);
    userComponentSet['methods'] = componentMethods;
    userComponentSet['state'] = componentConfigJSON.state;
    userComponentSet['fetch'] = componentConfigJSON.fetch;
    userComponentSet['lifeCycleMethods'] = componentConfigJSON.lifeCycleMethods;
    userComponentSet['renderBeforeReturn'] = componentConfigJSON.renderBeforeReturn;
    userComponentSet['defaultProps'] = componentConfigJSON.defaultProps;
    buildComponents.push(userComponentSet);
  });
}

let _ownCss = function (cssSeedDirectory, cssDist, configCssName, name) {
  const path = `${cssSeedDirectory}/${configCssName}`;
  const dist = `${cssDist}/${name}.css`;
  const importCss = `import './${name}.css';`;
  console.log(chalk.red(path));
  if(FS.existsSync(path)) {
    return { seed: path, dist: dist, import: importCss };
  }
  return null;
}

let _createOwnCss = function (ownCss) {
  if (ownCss === null) return;
  let cssFileBuffer = _readWholeFile(ownCss.seed);
  _writeDistFile(ownCss.dist, cssFileBuffer);
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

let _routeTags = function (routeInfo, redirect) {
  let result = "";
  let defaultExist = false;
  _.forEach(routeInfo, (route) => {
    if (route.component.toLowerCase() === 'default') {
      if (defaultExist === false) {
        result += (result ? '\n': '') + `<Route path="/page/:name" component={${route.component}} exact />`;
        defaultExist = true;
      }
      return;
    }
    result += (result ? '\n': '') + `<Route path="${route.url}" component={${route.component}} exact />`
  });
  result += (result ? '\n': '') + `<Redirect from="/" to="${redirect}" exact />`;
  return result;
}

let _importPages = function (routeInfo) {
  let result = "";
  _.forEach(routeInfo, (route) => {
    console.log(route.component.toLowerCase());
    if (route.component.toLowerCase() === "default") return;
    result += (result ? '\n': '') + `import ${route.component} from "./user-pages/${route.component}";`;
  });
  return result;
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
    let fetchData = _componentFetchData(componentSet);
    fileBuffer = _replaceTag('FETCH_DATA', fetchData, fileBuffer);
    _componentFetchLoading(componentSet);
    _componentState(componentSet);
    let lifeCycleMethod = _componentLifeCycleMethod(componentSet);
    fileBuffer = _replaceTag('LIFE_CYCLE_METHOD', lifeCycleMethod, fileBuffer);
    let componentMethod = _componentMethod(componentSet);
    fileBuffer = _replaceTag('COMPONENT_METHOD', componentMethod, fileBuffer);
    let renderFetchDone = _componentRenderFetchDone(componentSet);
    fileBuffer = _replaceTag('RENDER_FETCH_DONE', renderFetchDone, fileBuffer);
    let renderBeforeReturn = _componentRenderBeforeReturn(componentSet);
    fileBuffer = _replaceTag('RENDER_BEFORE_RETURN', renderBeforeReturn, fileBuffer);
    let userComponentImportDeclaration = _importComponentDeclaration(importComponents);
    fileBuffer = _replaceTag('IMPORT_COMPONENTS', userComponentImportDeclaration, fileBuffer);
    let userComopnentDefaultImportDeclaration = _importDefaultImportComponentDeclaration(defaultImportComponents);
    fileBuffer = _replaceTag('DEFAULT_IMPORT_COMPONENTS', userComopnentDefaultImportDeclaration, fileBuffer);
    let userImportCssDeclaration = _importImportCssDeclaration(importCss);
    fileBuffer = _replaceTag('IMPORT_CSS', userImportCssDeclaration, fileBuffer);
    let userImportOwnCssDeclaration = (componentSet.ownCss ? componentSet.ownCss.import : '');
    fileBuffer = _replaceTag('IMPORT_OWN_CSS', userImportOwnCssDeclaration, fileBuffer);
    let stateInterface = _readTemp(componentSet.name, TEMP_EXT_STATE_INTERFACE);
    fileBuffer = _replaceTag('STATE_INTERFACE', stateInterface?`interface State {${stateInterface}}`:'', fileBuffer);
    let dataType = _readTemp(componentSet.name, TEMP_EXT_TYPE);
    fileBuffer = _replaceTag('DATA_TYPE', dataType, fileBuffer);
    let stateInit = _readTemp(componentSet.name, TEMP_EXT_STATE_INIT);
    fileBuffer = _replaceTag('STATE_INIT', stateInit?`state: State = {${stateInit}};`:'', fileBuffer);
    fileBuffer = _replaceTag('INTERFACE', (fetchData?'<{}, State>':''), fileBuffer);
    _writeDistFile(_distFilePath(componentFilePath), fileBuffer);
    _createOwnCss(componentSet.ownCss);
  });
}

let _componentFetchData = function (componentSet) {
  let functionName = '_componentFetchData()';
  if (_isSet(componentSet, 'fetch', functionName) === false) return '';
  let componentFetchData = '';
  _.forEach(componentSet.fetch, (fetch) => {
    if (_isSet(fetch, 'format', functionName) === false) return '';
    if (_isSet(fetch, 'apis', functionName) === false) return '';
    if (fetch.format === 'get') {
      componentFetchData += _componentFetchGet(componentSet.name, fetch)
    } else if (fetch.format === 'post') {
      componentFetchData += _componentFetchPost(componentSet.name, fetch)
    }
  });
  return componentFetchData;
}

let _componentFetchGet = function (componentName, fetch) {
  let functionName = '_componentFetchGet()';
  let templateFetchDataFilePath = `${USER_COMMON_TEMPLATE}/fetch-${fetch.format}.ts.tpl`;
  let type = '', stateInterface = '';
  let fetchApi = '', setState = '';
  let responseType = '', apiCount = 0;
  _.forEach(fetch.apis, (api, i) => {
    type += (type?'\n': '') + `type ${api.responseTypeName} = {${api.responseType}};`;
    stateInterface += `${api.responseTypeName}:{isLoading: false;data: ${api.responseTypeName};} | {isLoading: true;},`;
    fetchApi += (fetchApi?', ': '') + `() => fetch.get<${api.responseTypeName}>('${api.api}'${(api.init?', '+api.init:'')})`;
    responseType += (responseType?'|': '') + api.responseTypeName;
    apiCount++;
    setState += (setState?', ': '') + `${api.responseTypeName}: {\nisLoading: false,\ndata: results[${i}] as ${api.responseTypeName}\n}`;
  });
  _appendTemp(componentName, TEMP_EXT_TYPE, type);
  _appendTemp(componentName, TEMP_EXT_STATE_INTERFACE, stateInterface);
  let fetchDataBuffer = _readWholeFile(templateFetchDataFilePath);
  fetchDataBuffer = _replaceTag('FETCH', fetchApi, fetchDataBuffer);
  fetchDataBuffer = _replaceTag('RETURN_TYPE', responseType?`<${responseType}>`:'', fetchDataBuffer);
  fetchDataBuffer = _replaceTag('API_COUNT', apiCount, fetchDataBuffer);
  fetchDataBuffer = _replaceTag('SET_STATE', setState, fetchDataBuffer);
  fetchDataBuffer = _replaceTag('CODE_FIRST', (fetch.codeFirst ? fetch.codeFirst : ''), fetchDataBuffer);
  fetchDataBuffer = _replaceTag('CODE_LAST', (fetch.codeLast ? fetch.codeLast : ''), fetchDataBuffer);
  return fetchDataBuffer;
}

let _componentFetchPost = function (componentName, fetch) {
  let functionName = '_componentFetchPost()';
  let templateFetchDataFilePath = `${USER_COMMON_TEMPLATE}/fetch-${fetch.format}.ts.tpl`;
  let type = '', stateInterface = '';
  let fetchApi = '', setState = '';
  let postType = '', postBody = '', responseType = '', apiCount = 0;
  _.forEach(fetch.apis, (api, i) => {
    type += (type?'\n': '') + `type ${api.postTypeName} = {${api.postType}};`;
    type += (type?'\n': '') + `type ${api.responseTypeName} = {${api.responseType}};`;
    stateInterface += `${api.responseTypeName}:{isLoading: false;data: ${api.responseTypeName};} | {isLoading: true;},`;
    fetchApi += (fetchApi?', ': '') + `() => fetch.post<${api.postTypeName}, ${api.responseTypeName}>('${api.api}'${(api.init?', '+api.init:'')}, ${api.postBody})`;
    postType += (postType?'|': '') + api.postTypeName;
    responseType += (responseType?'|': '') + api.responseTypeName;
    apiCount++;
    setState += (setState?', ': '') + `${api.responseTypeName}: {\nisLoading: false,\ndata: results[${i}] as ${api.responseTypeName}\n}`;
  });
  _appendTemp(componentName, TEMP_EXT_TYPE, type);
  _appendTemp(componentName, TEMP_EXT_STATE_INTERFACE, stateInterface);
  let fetchDataBuffer = _readWholeFile(templateFetchDataFilePath);
  fetchDataBuffer = _replaceTag('METHOD_NAME', fetch.name, fetchDataBuffer);
  fetchDataBuffer = _replaceTag('ARGS', fetch.args, fetchDataBuffer);
  fetchDataBuffer = _replaceTag('FETCH', fetchApi, fetchDataBuffer);
  fetchDataBuffer = _replaceTag('TEMPLATE_TYPE', responseType?`<${responseType}>`:'', fetchDataBuffer);
  fetchDataBuffer = _replaceTag('API_COUNT', apiCount, fetchDataBuffer);
  fetchDataBuffer = _replaceTag('POST_BODY', postBody, fetchDataBuffer);
  fetchDataBuffer = _replaceTag('SET_STATE', setState, fetchDataBuffer);
  fetchDataBuffer = _replaceTag('CODE_FIRST', (fetch.codeFirst ? fetch.codeFirst : ''), fetchDataBuffer);
  fetchDataBuffer = _replaceTag('CODE_LAST', (fetch.codeLast ? fetch.codeLast : ''), fetchDataBuffer);
  return fetchDataBuffer;
}

let _componentFetchLoading = function (componentSet) {
  let functionName = '_componentFetchLoading()';
  if (_isSet(componentSet, 'fetch', functionName) === false) return '';
  _.forEach(componentSet.fetch, (fetch) => {
    if (_isSet(fetch, 'apis', functionName) === false) return '';
    let fetchLoading = '';
    _.forEach(fetch.apis, (api) => {
      fetchLoading += `${api.responseTypeName}: {isLoading: true},`;
    });
    _appendTemp(componentSet.name, TEMP_EXT_STATE_INIT, fetchLoading);
  });
}

let _componentState = function (componentSet) {
  let functionName = '_componentState()';
  if (_isSet(componentSet, 'state', functionName) === false) return '';
  _.forEach(componentSet.state, (state) => {
    let params = ''
    let init = '';
    _.forEach(state.params, (param) => {
      params += `${param.name}: ${param.type},`;
      init += `${param.name}: ${param.init},`;
      console.log(param.name);
    });
    if (params) {
      _appendTemp(componentSet.name, TEMP_EXT_STATE_INTERFACE, `${state.name}: {${params}};`);
    }
    if (init) {
      _appendTemp(componentSet.name, TEMP_EXT_STATE_INIT, `${state.name}: {${init}},`);
    }
  });
}

let _componentLifeCycleMethod = function (componentSet) {
  let functionName = '_componentLifeCycleMethod()';
  if (_isSet(componentSet, 'lifeCycleMethods', functionName) === false) return '';
  let lifeCycleMethods = '';
  _.forEach(componentSet.lifeCycleMethods, (lifeCycleMethod) => {
    lifeCycleMethods += `${lifeCycleMethod.methodName}(){${lifeCycleMethod.code}}`;
  });
  return lifeCycleMethods;
}

let _componentMethod = function (componentSet) {
  let functionName = '_componentMethod()';
  if (_isSet(componentSet, 'methods', functionName) === false) return '';
  let result = ""
  _.forEach(componentSet.methods, (componentMethod) => {
    if (_isSet(componentMethod, 'methods', functionName) === false) return '';
    _.forEach(componentMethod.methods, (eachComponentMethod) => {
      result += _userFunction(eachComponentMethod.methodType, eachComponentMethod);
    });
  });
  return result;
}
let _userFunction = function (template, componentMethod) {
  let methodParams = _readWholeFile(`${USER_COMPONENT_METHOD}/${template}.param`);
  console.log(`${USER_COMPONENT_METHOD}/${template}.param`);
  if (methodParams === null) {
    throw `Could not find method params file: ${template}`;
  }
  let methodTemplate = _readWholeFile(`${USER_COMPONENT_METHOD}/${template}.method.tpl`);
  if (methodTemplate === null) {
    throw `Could not find method template: ${template}`;
  }
  methodParams = methodParams.split('\n').filter(v => v);
  methodTemplate = _replaceTag('args', _userMethodArgs(componentMethod.args), methodTemplate);
  _.forEach(methodParams, methodParam => {
    _isSet(componentMethod, methodParam, `${template}()`, true);
    methodTemplate = _replaceTag(methodParam, componentMethod[methodParam], methodTemplate);
  });
  return methodTemplate;
}

let _userMethodArgs = function (methodArgs) {
  let result = "";
  if (methodArgs === undefined) return result;
  if (methodArgs.length === 0) return result;
  let duplicate = methodArgs.filter(function (x, i, self) {
    return self.indexOf(x) !== self.lastIndexOf(x);
  });
  if (duplicate.length) {
    throw `Function argument '${duplicate[0]}' has duplicated.`;
  }
  result = methodArgs.join(',');
  return result;
}

let _componentRenderFetchDone = function (componentSet) {
  let functionName = '_componentRenderFetchDone()';
  if (_isSet(componentSet, 'fetch', functionName) === false) return '';
  if (_isSet(componentSet.fetch, 'apis', functionName) === false) return '';
  let fetchDoneCondition = '';
  _.forEach(componentSet.fetch.apis, (api) => {
    fetchDoneCondition += (fetchDoneCondition?' || ': '') + `this.state.${api.responseTypeName}.isLoading`;
  });
  let fetchDone = `if (${fetchDoneCondition}) { return <React.Fragment />;}`;
  return fetchDone;
}

let _componentRenderBeforeReturn = function (componentSet) {
  let functionName = '_componentRenderBeforeReturn()';
  if (_isSet(componentSet, 'renderBeforeReturn', functionName) === false) return '';
  let renderBeforeReturn = '';
  _.forEach(componentSet.renderBeforeReturn, (code) => {
    renderBeforeReturn += (renderBeforeReturn?'\n': '') + code;
  });
  return renderBeforeReturn;
}

let _replaceTag = function (tagString, replaceString, buffer, startWith='') {
  tagString = new RegExp(startWith + '<!--@@' + tagString + '-->','g');
  console.log('REPLACE: ' + tagString + ' ==> ' + replaceString);
  // console.log(buffer);
  return buffer.replace(tagString, replaceString);
};
