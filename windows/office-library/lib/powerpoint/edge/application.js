/* global __dirname */
'use strict'
var path = require('path')
var edge = require('electron-edge-js')

var application = edge.func({
  assemblyFile: path.join(__dirname, '../../../dist/OfficeScript.dll'),
  typeName: 'OfficeScript.Startup',
  methodName: 'PowerPointApplication'
})

module.exports = application
