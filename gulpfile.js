const _ = require('lodash');
const chalk = require('chalk');
const gulp = require('gulp');
const FS = require('fs');
const path = require('path');
const gulpfs = require('./gulplib/gulpfs');
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
  gulpfs.cleanDirectories(TEMP_DIR);
  gulpfs.cleanDirectories(USER_COMPONENT_DIST);
  let userComponentsJSONFilePaths = gulpfs.jsonFilePaths(USER_COMPONENT_JSON);
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
  gulpfs.cleanDirectories(USER_PAGE_DIST);
  let userPagesJSONFilePaths = gulpfs.jsonFilePaths(USER_PAGE_JSON);
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
    done(`Could not find ${MENU_CONFIG_JSON}.`);
    return;
  }
  let menuConfigJSON = gulpfs.JSONdata(MENU_CONFIG_JSON);
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
  let appTemplateFileBuffer = gulpfs.readWholeFile(APP_TEMPLATE_PATH);
  let importPages = _importPages(routeInfo);
  appTemplateFileBuffer = _replaceTag('IMPORT_PAGES', importPages, appTemplateFileBuffer);
  let routeTags = _routeTags(routeInfo, redirect);
  appTemplateFileBuffer = _replaceTag('ROUTER', routeTags, appTemplateFileBuffer);
  gulpfs.writeDistFile(`${APP_DIST}${target}.tsx`, appTemplateFileBuffer);
  done();
});

/**
 * Create Menu
 */
gulp.task('create-menu', function (done){
  console.log(' 🚀🚀🚀 ' + chalk.bgRed(' create-menu ') + ' 🚀🚀🚀 ');
  const target = 'Menu';
  if(FS.existsSync(MENU_TEMPLATE_PATH) === false || FS.existsSync(MENU_CONFIG_JSON) === false) {
    if (FS.existsSync(`${APP_COMPONENTS_DIST}${target}.tsx`)) FS.unlinkSync(`${APP_COMPONENTS_DIST}${target}.tsx`);
    if (FS.existsSync(`${APP_COMPONENTS_DIST}${target}.css`)) FS.unlinkSync(`${APP_COMPONENTS_DIST}${target}.css`);
    done();
    return;
  }
  let menuConfigJSON = gulpfs.JSONdata(MENU_CONFIG_JSON);
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
  let menuTemplateFileBuffer = gulpfs.readWholeFile(MENU_TEMPLATE_PATH);
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
  gulpfs.writeDistFile(`${APP_COMPONENTS_DIST}${target}.tsx`, menuTemplateFileBuffer);
  let menuCssFileBuffer = gulpfs.readWholeFile(`${APP_CSS_DIR}${target}.css`);
  gulpfs.writeDistFile(`${APP_COMPONENTS_DIST}${target}.css`, menuCssFileBuffer);
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

let _componentName = function (component) {
  return component.charAt(0).toUpperCase() + _.camelCase(component).slice(1);
};

let _appendTemp = function (name, ext, buffer) {
  let tempStateFilePath = `${TEMP_DIR}/${name}.${ext}`;
  gulpfs.appendDistFile(tempStateFilePath, buffer);
}

let _readTemp = function (name, ext) {
  let tempStateFilePath = `${TEMP_DIR}/${name}.${ext}`;
  if(FS.existsSync(tempStateFilePath) === false) {
    return ''
  }
  let tempBuffer = gulpfs.readWholeFile(tempStateFilePath);
  return tempBuffer;
}

let _componentBuild = function (componentConfigJSONFilePaths, cssSeedDirectory, cssDist, buildComponents) {
  _.forEach(componentConfigJSONFilePaths, (componentConfigJSONFilePath) => {
    let componentConfigJSON = gulpfs.JSONdata(componentConfigJSONFilePath);
    let componentName = _componentName(componentConfigJSON.name);
    let tags = [];
    _htmlTagRecursive(componentConfigJSON, tags);
    let componentMethods = [];
    _componentMethodRecursiveWithOverlapCheck(componentConfigJSON, componentMethods);
    let userComponentSet = {};
    _.forEach(componentConfigJSON, (value, key) => {
      userComponentSet[key] = value;
    });
    userComponentSet['html'] = _tagToHtml(tags);
    userComponentSet['ownCss'] = _ownCss(cssSeedDirectory, cssDist, path.basename(componentConfigJSONFilePath).replace("json", "css"), componentName);
    userComponentSet['methods'] = componentMethods;
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
  let cssFileBuffer = gulpfs.readWholeFile(ownCss.seed);
  gulpfs.writeDistFile(ownCss.dist, cssFileBuffer);
}

let _htmlTagRecursive = function (sauceJSON, tags, closeTag, type) {
  if (_.isUndefined(sauceJSON.tags) === false) {
    _.forEach(sauceJSON.tags, (component) => {
      let openTagSet = {"open": component.tag, "props": _componentProperties(component) + " " + _componentEvents(component)};
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

let _componentEvents = function (component) {
  let functionName = '_componentEvents()';
  if (_isSet(component, 'events', functionName) === false) return '';
  let events = '';
  _.forEach(component.events, (event) => {
    let templateEventFilePath = `${USER_COMMON_TEMPLATE}/event-${event.eventName}.tpl`;
    if(FS.existsSync(templateEventFilePath) === false) {
      throw `Could not find ${templateEventFilePath} for ${event.eventName}`;
    }
    let eventBuffer = gulpfs.readWholeFile(templateEventFilePath);
    let eventCode = _componentEventCallFunction(event);
    eventBuffer = _replaceTag('EVENT_CODE', eventCode, eventBuffer);
    events += eventBuffer;
  });
  return events;
}

let _componentEventCallFunction = function (event) {
  let functionName = '_componentEventCallFunction()';
  let functionArgs = '';
  if (_isSet(event, 'call', functionName) === false) return '';
  _.forEach(event.args, (arg) => {
    functionArgs += (functionArgs?', ':'') + arg;
  });
  return `this.${event.call}(${functionArgs})`;
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
  let orgFileBuffer = gulpfs.readWholeFile(templateFilePath);
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
    gulpfs.writeDistFile(_distFilePath(componentFilePath), fileBuffer);
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
  let type = '';
  let fetchApi = '';
  _.forEach(fetch.apis, (api) => {
    type += (type?'\n': '') + `type ${api.responseTypeName} = {${api.responseType}};`;
    fetchApi += (fetchApi?', ': '') + `() => fetch.get<${api.responseTypeName}>('${api.api}'${(api.init?', '+api.init:'')})`;
  });
  _componentFetchAppendTemp(componentName, type, fetch);
  return _componentFetchDataReplacement(templateFetchDataFilePath, fetchApi, fetch);
}

let _componentFetchPost = function (componentName, fetch) {
  let functionName = '_componentFetchPost()';
  let templateFetchDataFilePath = `${USER_COMMON_TEMPLATE}/fetch-${fetch.format}.ts.tpl`;
  let type = '';
  let fetchApi = '';
  let postType = '';
  _.forEach(fetch.apis, (api) => {
    type += (type?'\n': '') + `type ${api.postTypeName} = {${api.postType}};`;
    type += (type?'\n': '') + `type ${api.responseTypeName} = {${api.responseType}};`;
    fetchApi += (fetchApi?', ': '') + `() => fetch.post<${api.postTypeName}, ${api.responseTypeName}>('${api.api}'${(api.init?', '+api.init:'')}, ${_componentFetchPostBody(api)})`;
    postType += (postType?'|': '') + api.postTypeName;
  });
  _componentFetchAppendTemp(componentName, type, fetch);
  return _componentFetchDataReplacement(templateFetchDataFilePath, fetchApi, fetch);
}

let _componentFetchAppendTemp = function (componentName, type, fetch) {
  _appendTemp(componentName, TEMP_EXT_TYPE, type);
  _appendTemp(componentName, TEMP_EXT_STATE_INTERFACE, _componentFetchStateInterface(fetch));
}

let _componentFetchDataReplacement = function (templateFetchDataFilePath, fetchApi, fetch) {
  let fetchDataBuffer = gulpfs.readWholeFile(templateFetchDataFilePath);
  fetchDataBuffer = _replaceTag('METHOD_NAME', fetch.name, fetchDataBuffer);
  fetchDataBuffer = _replaceTag('ARGS', _componentFetchMethodArgs(fetch), fetchDataBuffer);
  fetchDataBuffer = _replaceTag('FETCH', fetchApi, fetchDataBuffer);
  fetchDataBuffer = _replaceTag('RETURN_TYPE', _componentFetchResponseType(fetch), fetchDataBuffer);
  fetchDataBuffer = _replaceTag('API_COUNT', _componentFetchApiCount(fetch), fetchDataBuffer);
  fetchDataBuffer = _replaceTag('SET_STATE', _componentFetchSetState(fetch), fetchDataBuffer);
  fetchDataBuffer = _replaceTag('CODE_FIRST', (fetch.codeFirst ? fetch.codeFirst : ''), fetchDataBuffer);
  fetchDataBuffer = _replaceTag('CODE_LAST', (fetch.codeLast ? fetch.codeLast : ''), fetchDataBuffer);
  return fetchDataBuffer;
}

let _componentFetchPostBody = function (api) {
  if (api.postBody === undefined) return '';
  let result = '';
  _.forEach(api.postBody, (postBody) => {
    result += (result ? ',': '') + postBody;
  });
  return `{${result}}`;
}

let _componentFetchStateInterface = function (fetch) {
  let stateInterface = '';
  _.forEach(fetch.apis, (api) => {
    stateInterface += `${api.responseTypeName}:{isLoading: false;data: ${api.responseTypeName};} | {isLoading: true;},`;
  });
  return stateInterface;
}

let _componentFetchMethodArgs = function (fetch) {
  let methodArgs = '';
  _.forEach(fetch.apis, (api) => {
    methodArgs += (methodArgs?', ': '') + _componentFetchArgs(api);
  });
  return methodArgs;
}

let _componentFetchArgs = function (api) {
  if (api.args === undefined) return '';
  let result = '';
  _.forEach(api.args, (args) => {
    result += (result ? ',': '') + args;
  });
  return result;
}

let _componentFetchApiCount = function (fetch) {
  return fetch.apis.length;
}

let _componentFetchResponseType = function (fetch) {
  let responseType = '';
  _.forEach(fetch.apis, (api) => {
    responseType += (responseType?'|': '') + api.responseTypeName;
  });
  return responseType?`<${responseType}>`:'';
}

let _componentFetchSetState = function (fetch) {
  let setState = '';
  _.forEach(fetch.apis, (api, i) => {
    setState += (setState?', ': '') + `${api.responseTypeName}: {\nisLoading: false,\ndata: results[${i}] as ${api.responseTypeName}\n}`;
  });
  return setState;
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
  let methodParams = gulpfs.readWholeFile(`${USER_COMPONENT_METHOD}/${template}.param`);
  console.log(`${USER_COMPONENT_METHOD}/${template}.param`);
  if (methodParams === null) {
    throw `Could not find method params file: ${template}`;
  }
  let methodTemplate = gulpfs.readWholeFile(`${USER_COMPONENT_METHOD}/${template}.method.tpl`);
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
  return `if (${fetchDoneCondition}) { return <React.Fragment />;}`;
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
