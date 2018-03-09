const path = require('path');
const packager = require('electron-packager');
const tmp = require('tmp');
const ncp = require('ncp');
const async = require('async');
const hasBinary = require('hasbin');
const log = require('loglevel');
const view = require('./../helpers/ProgressView');
const optionsFactory = require('./../options/optionsMain');
const setIcon = require('./setIcon');
const helpers = require('./../helpers/helpers');
const setApp = require('./setApp');
const copy = ncp.ncp;

/**
 * Checks the app path array to determine if the packaging was completed successfully
 * @param appPathArray Result from electron-packager
 * @returns {*}
 */
function getAppPath(appPathArray) {
  if (appPathArray.length === 0) {
    // directory already exists, --overwrite is not set
    // exit here
    return null;
  }

  if (appPathArray.length > 1) {
    log.warn('Warning: This should not be happening, packaged app path contains more than one element:', appPathArray);
  }
  return appPathArray[0];
}

/**
 * Removes the `icon` parameter from options if building for Windows while not on Windows
 * and Wine is not installed
 * @param options
 */
function maybeNoIconOption(options) {
  const packageOptions = JSON.parse(JSON.stringify(options));
  if (options.platform === 'win32' && !helpers.isWindows()) {
    if (!hasBinary.sync('wine')) {
      log.warn('Wine is required to set the icon for a Windows app when packaging on non-windows platforms');
      packageOptions.icon = null;
    }
  }
  return packageOptions;
}

/**
 * For windows and linux, we have to copy over the icon to the resources/app folder, which the
 * BrowserWindow is hard coded to read the icon from
 * @param {{}} options
 * @param {string} appPath
 * @param callback
 */
function maybeCopyIcons(options, appPath, callback) {
  if (!options.icon) {
    callback();
    return;
  }

  if (options.platform === 'darwin' || options.platform === 'mas') {
    callback();
    return;
  }

  // windows & linux
  // put the icon file into the app
  const destIconPath = path.join(appPath, 'resources/app');
  const destFileName = `icon${path.extname(options.icon)}`;
  copy(options.icon, path.join(destIconPath, destFileName), (error) => {
    callback(error);
  });
}

/**
 * Removes invalid parameters from options if building for Windows while not on Windows
 * and Wine is not installed
 * @param options
 * @param param
 */
function removeInvalidOptions(options, param) {
  const packageOptions = JSON.parse(JSON.stringify(options));
  if (options.platform === 'win32' && !helpers.isWindows()) {
    if (!hasBinary.sync('wine')) {
      log.warn(`Wine is required to use "${param}" option for a Windows app when packaging on non-windows platforms`);
      packageOptions[param] = null;
    }
  }
  return packageOptions;
}

/**
 * Removes the `appCopyright` parameter from options if building for Windows while not on Windows
 * and Wine is not installed
 * @param options
 */
function maybeNoAppCopyrightOption(options) {
  return removeInvalidOptions(options, 'appCopyright');
}

/**
 * Removes the `buildVersion` parameter from options if building for Windows while not on Windows
 * and Wine is not installed
 * @param options
 */
function maybeNoBuildVersionOption(options) {
  return removeInvalidOptions(options, 'buildVersion');
}

/**
 * Removes the `appVersion` parameter from options if building for Windows while not on Windows
 * and Wine is not installed
 * @param options
 */
function maybeNoAppVersionOption(options) {
  return removeInvalidOptions(options, 'appVersion');
}

/**
 * Removes the `versionString` parameter from options if building for Windows while not on Windows
 * and Wine is not installed
 * @param options
 */
function maybeNoVersionStringOption(options) {
  return removeInvalidOptions(options, 'versionString');
}

/**
 * Removes the `win32metadata` parameter from options if building for Windows while not on Windows
 * and Wine is not installed
 * @param options
 */
function maybeNoWin32metadataOption(options) {
  return removeInvalidOptions(options, 'win32metadata');
}

/**
 * @callback buildAppCallback
 * @param error
 * @param {string} appPath
 */

/**
 *
 * @param {{}} inpOptions
 * @param {buildAppCallback} callback
 */
function setMain(inpOptions, callback) {
  
  const options = Object.assign({}, inpOptions);
  // pre process app
  const tmpObj = tmp.dirSync({unsafeCleanup: true});
  const tmpPath = tmpObj.name;
  const progress = new view.ProgressView(5);
  async.waterfall([
    (cb) => {
      progress.tick('interpretation process');
      optionsFactory(options)
        .then((result) => {
          cb(null, result);
        }).catch((error) => {
          cb(error);
        });
    },
    (opts, cb) => {
      progress.tick('copying app');
      setApp(opts.dir, tmpPath, opts, (error) => {
        if (error) {
          cb(error);
          return;
        }
        // Change the reference file for the Electron app to be the temporary path
        const newOptions = Object.assign({}, opts, { dir: tmpPath });
        cb(null, newOptions);
      });
    },
    (opts, cb) => {
      progress.tick('setting icons');
      setIcon(opts, (error, optionsWithIcon) => {
        cb(null, optionsWithIcon);
      });
    },
    (opts, cb) => {
      progress.tick('packaging app');
      // maybe skip passing icon parameter to electron packager
      let packageOptions = maybeNoIconOption(opts);
      // maybe skip passing other parameters to electron packager
      packageOptions = maybeNoAppCopyrightOption(packageOptions);
      packageOptions = maybeNoAppVersionOption(packageOptions);
      packageOptions = maybeNoBuildVersionOption(packageOptions);
      packageOptions = maybeNoVersionStringOption(packageOptions);
      packageOptions = maybeNoWin32metadataOption(packageOptions);
      // packagerConsole.override();
      packager(packageOptions, (error, appPathArray) => {
        // pass options which still contains the icon to waterfall
        cb(error, opts, appPathArray);
      });
    },
    (opts, appPathArray, cb) => {
      progress.tick('finalizing app');
      const appPath = getAppPath(appPathArray);
      if (!appPath) {
        cb();
        return;
      }
      maybeCopyIcons(opts, appPath, (error) => {
        cb(error, appPath);
      });
    },
  ], (error, appPath) => {
    callback(error, appPath);
  });
}

module.exports = setMain;
