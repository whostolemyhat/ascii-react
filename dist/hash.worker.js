/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.pixelToChar = pixelToChar;
	// lodash chunk function
	var chunk = function chunk(array, count) {
	  if (count == null || count < 1) return [];
	
	  var result = [];
	  var length = array.length;
	  var i = 0;
	  while (i < length) {
	    result.push(Array.prototype.slice.call(array, i, i += count));
	  }
	  return result;
	};
	
	function pixelToChar(pixel, mapLength) {
	  var averageShade = Math.floor(pixel.r * 0.3 + pixel.b * 0.3 + pixel.g * 0.3);
	  return Math.floor((255 - averageShade) * (mapLength / 256));
	}
	
	// export const charMap = ['@', '#', '%', 'x', 'o', ';', ':', ',', '.'];
	var charMap = exports.charMap = ['.', ',', ':', ';', 'o', 'x', '%', '#', '@'];
	
	self.onmessage = function (e) {
	  // eslint-disable-line no-undef
	  var pixels = e.data[0];
	  var options = e.data[1];
	
	  var resolution = options.resolution > 0 ? Math.ceil(options.resolution) : 1;
	
	  if (options.whitespace === 'spaces') {
	    charMap[0] = ' ';
	  }
	
	  if (options.invert) {
	    // Note: works in-place!
	    charMap.reverse();
	  }
	
	  // r,g,b,a
	  var PIXEL_LENGTH = 4;
	  var imgWidth = pixels.width * PIXEL_LENGTH;
	  var rowPercent = 100 / pixels.height;
	  var data = chunk(pixels.data, imgWidth);
	  var dataLength = data.length;
	  var out = '';
	
	  for (var i = 0; i < dataLength; i += resolution) {
	    for (var j = 0; j < data[i].length; j += PIXEL_LENGTH * resolution) {
	      var pixel = {};
	      pixel.r = data[i][j];
	      pixel.g = data[i][j + 1];
	      pixel.b = data[i][j + 2];
	      pixel.a = data[i][j + 3];
	
	      var char = charMap[pixelToChar(pixel, charMap.length)];
	      if (options.colour) {
	        char = '<span style="color:rgb(' + pixel.r + ', ' + pixel.g + ', ' + pixel.b + ')">' + char + '</span>';
	      }
	      out += char;
	    }
	
	    out += '\r\n';
	    postMessage({ type: 'progress', value: i * rowPercent });
	  }
	
	  postMessage({ type: 'result', value: out });
	};
	
	exports.AsciiWorker = self;

/***/ }
/******/ ]);
//# sourceMappingURL=hash.worker.js.map