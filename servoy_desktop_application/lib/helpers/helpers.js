const os = require('os');
const hasBinary = require('hasbin');
const path = require('path');

/**
 * Checks if the current platform is OSX
 * @returns {boolean}
 */
function isOSX() {
  return os.platform() === 'darwin';
}

/**
 * Checks if the current platform is Windows
 * @returns {boolean}
 */
function isWindows() {
  return os.platform() === 'win32';
}

/**
 * Checks if the current platform is Windows
 * @param {string} url
 * @return {Object}
 */
function downloadFile(url) {
  return axios.get(url, {
    responseType: 'arraybuffer',
  })
    .then((response) => {
      if (!response.data) {
        return null;
      }
      return {
        data: response.data,
        ext: path.extname(url),
      };
    });
}

/**
 * Checks if the current platform is Windows
 * @param {string} platform
 * @return {Object}
 */
function allowedIconFormats(platform) {
  const hasIdentify = hasBinary.sync('identify');
  const hasConvert = hasBinary.sync('convert');
  const hasIconUtil = hasBinary.sync('iconutil');

  const pngToIcns = hasConvert && hasIconUtil;
  const pngToIco = hasConvert;
  const icoToIcns = pngToIcns && hasIdentify;
  const icoToPng = hasConvert;

  const icnsToPng = false;
  const icnsToIco = false;
  const formats = [];

  // Temporary override of shell scripting since its not supported on Windows
  if (isWindows()) {
    switch (platform) {
      case 'darwin':
        formats.push('.icns');
        break;
      case 'linux':
        formats.push('.png');
        break;
      case 'win32':
        formats.push('.ico');
        break;
      default:
        throw new Error(`function allowedIconFormats error: Unknown platform ${platform}`);
    }
    return formats;
  }

  switch (platform) {
    case 'darwin':
      formats.push('.icns');
      if (pngToIcns) {
        formats.push('.png');
      }
      if (icoToIcns) {
        formats.push('.ico');
      }
      break;
    case 'linux':
      formats.push('.png');
      if (icoToPng) {
        formats.push('.ico');
      }
      if (icnsToPng) {
        formats.push('.icns');
      }
      break;
    case 'win32':
      formats.push('.ico');
      if (pngToIco) {
        formats.push('.png');
      }
      if (icnsToIco) {
        formats.push('.icns');
      }
      break;
    default:
      throw new Error(`function allowedIconFormats error: Unknown platform ${platform}`);
  }
  return formats;
}

module.exports = {
  isOSX,
  isWindows,
  allowedIconFormats,
};
