/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	module.exports = __webpack_require__(3);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Resizer = __webpack_require__(2);

	var container = document.querySelector('#demo-container'),
	    image = document.querySelector('#demo-content');

	var currentConfig = {
	  alignX: 'center',
	  alignY: 'center',
	  scale: 'best-fill',
	  forceStyle: true
	};

	Resizer.resizeAll(document.body);

	window.resizeImage = function (options) {
	  Object.assign(currentConfig, options);
	  Resizer.resize(container, image, currentConfig);
	};

	window.landscape = function () {
	  image.src = 'test3.png';
	  resizeImage(currentConfig);
	};

	window.portrait = function () {
	  image.src = 'test2.jpg';
	  resizeImage(currentConfig);
	};

	window.square = function () {
	  image.src = 'test1.jpg';
	  resizeImage(currentConfig);
	};

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function () {
	  'use strict';

	  var Resizer = {};

	  var ALIGNS = {
	    LEFT: 'left',
	    RIGHT: 'right',
	    CENTER: 'center',
	    MIDDLE: 'middle',
	    TOP: 'top',
	    BOTTOM: 'bottom'
	  };

	  var FITS = {
	    NONE: 'none',
	    FILL: 'fill',
	    BEST_FILL: 'best-fill',
	    BEST_FIT: 'best-fit',
	    BEST_FIT_DOWN_ONLY: 'best-fit-down'
	  };

	  var DEFAULT_OPTIONS = {
	    scale: FITS.BEST_FILL,
	    alignX: ALIGNS.CENTER,
	    alignY: ALIGNS.CENTER,
	    forceStyle: true,
	    //target     : document.body,
	    autoResize: true,
	    rounding: 'ceil',
	    selectors: {
	      container: '.ffcp-container',
	      image: '.ffcp-image'
	    }
	  };

	  Resizer.resize = function (container, image, options) {
	    var errors = [];

	    if (!(container instanceof HTMLElement)) errors.push('wrong container parameter');
	    if (!(image instanceof HTMLElement)) errors.push('wrong image parameter');
	    if (errors.length) {
	      errors.forEach(function (err) {
	        return console.warn(err);
	      });
	      return;
	    }
	    _waitTillContentReady(image).then(function () {
	      if (image.cache) {
	        if (image.cache.src === image.src) {
	          Object.assign(image, image.cache);
	        } else {
	          _srcChanged(image, container, options);
	          return;
	        }
	      } else image.cache = {
	        width: image.width,
	        height: image.height,
	        src: image.src
	      };
	      var parameters = _getImageParameters(image, container, options || {});

	      if (!!options.forceStyle) _forceStyle(image, container);
	      var dest = {};
	      dest.width = parameters.containerWidth;
	      dest.height = parameters.containerHeight;
	      var source = {};
	      source.width = parameters.imageWidth;
	      source.height = parameters.imageHeight;

	      var layout = _calculateLayout(parameters.scale, parameters.align, source, dest);

	      if (['ceil', 'floor', 'round'].indexOf(parameters.rounding) !== -1) {
	        _roundLayoutDimensions(layout, parameters.rounding);
	      }
	      _applyLayout(image.style, layout);
	      _show(image);
	    });
	  };

	  Resizer.resizeAll = function (target, options) {
	    if (!(target instanceof HTMLElement)) {
	      console.warn('wrong target parameter');
	      return;
	    }

	    var opts = Object.assign({}, DEFAULT_OPTIONS, options),
	        pairs = _parse(target, opts.selectors.container, opts.selectors.image);
	    pairs.forEach(function (pair) {
	      return Resizer.resize(pair.container, pair.image, opts);
	    });
	  };

	  function _forceStyle(image, container) {
	    var containerStyle = window.getComputedStyle(container),
	        imageStyle = window.getComputedStyle(image);

	    if (containerStyle.position !== 'fixed' && containerStyle.position !== 'relative' && containerStyle.position !== 'absolute') {
	      container.style.position = 'relative';
	    }
	    if (imageStyle.position !== 'fixed' && imageStyle.position !== 'relative' && imageStyle.position !== 'absolute') {
	      image.style.position = 'absolute';
	    }
	    if (containerStyle.overflow !== 'hidden') container.style.overflow = 'hidden';
	  }

	  function _getImageParameters(image, container, options) {
	    var params = {};
	    params.containerWidth = options.containerWidth || container.dataset.width || container.getAttribute('width') || container.offsetWidth;
	    params.containerHeight = options.containerHeight || container.dataset.heigh || container.getAttribute('height') || container.offsetHeight;
	    params.imageWidth = options.imageWidth || image.dataset.width || image.getAttribute('width') || image.offsetWidth;
	    params.imageHeight = options.imageHeight || image.dataset.height || image.getAttribute('height') || image.offsetHeight;
	    params.scale = options.scale || image.dataset.scale;
	    params.rounding = options.rounding || image.dataset.rounding;
	    params.align = {
	      x: options.alignX || image.dataset['align-x'],
	      y: options.alignY || image.dataset['align-y']
	    };
	    return params;
	  }

	  function _applyLayout(targetImageStyle, layout) {
	    targetImageStyle.position = 'relative';
	    targetImageStyle.top = layout.y + 'px';
	    targetImageStyle.left = layout.x + 'px';
	    targetImageStyle.width = layout.width + 'px';
	    targetImageStyle.height = layout.height + 'px';
	    targetImageStyle.maxWidth = 'none';
	    targetImageStyle.margin = 0;
	  }

	  function _roundLayoutDimensions(layout, rounding) {
	    layout.width = Math[rounding](layout.width);
	    layout.height = Math[rounding](layout.height);
	    layout.x = Math[rounding](layout.x);
	    layout.y = Math[rounding](layout.y);
	  }

	  function _parse(target, containerSelector, imageSelector) {
	    var containers = target.querySelectorAll(containerSelector),
	        pairs = [];[].forEach.call(containers, function (container, i) {
	      var image = container.querySelector(imageSelector);
	      if (image) {
	        pairs.push({ container: container, image: image });
	      } else {
	        console.warn('Failed to find an image in your container.');
	      }
	    });

	    return pairs;
	  }

	  function _waitTillContentReady(image) {
	    return new Promise(function (resolve) {
	      image.onload = function () {
	        resolve();
	        _show(image);
	        image.onload = null;
	      };
	      image.src = image.src;
	    });
	  }

	  function _srcChanged(image, container, options) {
	    var tmpImage = document.createElement('img'); // in-memory image for getting real image size
	    tmpImage.onload = function () {
	      image.cache.src = tmpImage.src;
	      image.cache.width = tmpImage.width;
	      image.cache.height = tmpImage.height;
	      Resizer.resize(container, image, options); // resize again after new image is loaded. May be not the best solution
	      _show(image);
	    };
	    tmpImage.src = image.src;
	    _hide(image);
	  }

	  function _hide(element) {
	    element.style.display = 'none';
	  }

	  function _show(element) {
	    element.style.display = 'block';
	  }

	  function _calculateLayout(fit, align, source, dest) {
	    var scaleX = undefined,
	        scaleY = undefined,
	        scaleFactor = undefined;

	    var result = { x: 0, y: 0, width: dest.width, height: dest.height };
	    if (fit === FITS.FILL) return result;

	    scaleX = dest.width / source.width;
	    scaleY = dest.height / source.height;

	    switch (fit) {
	      case FITS.BEST_FIT_DOWN_ONLY:
	        if (source.width > dest.width || source.height > dest.height) {
	          scaleFactor = scaleX < scaleY ? scaleX : scaleY;
	        } else {
	          scaleFactor = 1.0;
	        }
	        break;
	      case FITS.BEST_FIT:
	        scaleFactor = scaleX < scaleY ? scaleX : scaleY;
	        break;
	      case FITS.NONE:
	        scaleFactor = 1.0;
	        break;
	      case FITS.BEST_FILL:
	      default:
	        scaleFactor = scaleX > scaleY ? scaleX : scaleY;
	        break;
	    }

	    result.width = Math.round(source.width * scaleFactor);
	    result.height = Math.round(source.height * scaleFactor);

	    switch (align.x) {
	      case ALIGNS.LEFT:
	        result.x = 0;
	        break;
	      case ALIGNS.RIGHT:
	        result.x = dest.width - result.width;
	        break;
	      case ALIGNS.MIDDLE:
	      case ALIGNS.CENTER:
	        result.x = (dest.width - result.width) / 2;
	        break;
	    }

	    switch (align.y) {
	      case ALIGNS.TOP:
	        result.y = 0;
	        break;
	      case ALIGNS.BOTTOM:
	        result.y = dest.height - result.height;
	        break;
	      case ALIGNS.MIDDLE:
	      case ALIGNS.CENTER:
	        result.y = (dest.height - result.height) / 2;
	        break;
	    }

	    return result;
	  }

	  Resizer.ALIGNS = ALIGNS;
	  Resizer.FITS = FITS;

	  return Resizer;
	}();

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__dirname) {'use strict';

	var path = __webpack_require__(4);

	module.exports = {
	  module: {
	    loaders: [{ test: /\.js$/, exclude: /(node_modules)/, loader: 'babel', query: { presets: ['es2015'] } }]
	  },
	  entry: ['./src/test'], // file extension after index is optional for .js files
	  output: {
	    path: path.join(__dirname, 'dist'),
	    filename: 'bundle.js'
	  }
	};
	/* WEBPACK VAR INJECTION */}.call(exports, "/"))

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	// resolves . and .. elements in a path array with directory names there
	// must be no slashes, empty elements, or device names (c:\) in the array
	// (so also no leading and trailing slashes - it does not distinguish
	// relative and absolute paths)
	function normalizeArray(parts, allowAboveRoot) {
	  // if the path tries to go above the root, `up` ends up > 0
	  var up = 0;
	  for (var i = parts.length - 1; i >= 0; i--) {
	    var last = parts[i];
	    if (last === '.') {
	      parts.splice(i, 1);
	    } else if (last === '..') {
	      parts.splice(i, 1);
	      up++;
	    } else if (up) {
	      parts.splice(i, 1);
	      up--;
	    }
	  }

	  // if the path is allowed to go above the root, restore leading ..s
	  if (allowAboveRoot) {
	    for (; up--; up) {
	      parts.unshift('..');
	    }
	  }

	  return parts;
	}

	// Split a filename into [root, dir, basename, ext], unix version
	// 'root' is just a slash, or nothing.
	var splitPathRe =
	    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
	var splitPath = function(filename) {
	  return splitPathRe.exec(filename).slice(1);
	};

	// path.resolve([from ...], to)
	// posix version
	exports.resolve = function() {
	  var resolvedPath = '',
	      resolvedAbsolute = false;

	  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
	    var path = (i >= 0) ? arguments[i] : process.cwd();

	    // Skip empty and invalid entries
	    if (typeof path !== 'string') {
	      throw new TypeError('Arguments to path.resolve must be strings');
	    } else if (!path) {
	      continue;
	    }

	    resolvedPath = path + '/' + resolvedPath;
	    resolvedAbsolute = path.charAt(0) === '/';
	  }

	  // At this point the path should be resolved to a full absolute path, but
	  // handle relative paths to be safe (might happen when process.cwd() fails)

	  // Normalize the path
	  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
	    return !!p;
	  }), !resolvedAbsolute).join('/');

	  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
	};

	// path.normalize(path)
	// posix version
	exports.normalize = function(path) {
	  var isAbsolute = exports.isAbsolute(path),
	      trailingSlash = substr(path, -1) === '/';

	  // Normalize the path
	  path = normalizeArray(filter(path.split('/'), function(p) {
	    return !!p;
	  }), !isAbsolute).join('/');

	  if (!path && !isAbsolute) {
	    path = '.';
	  }
	  if (path && trailingSlash) {
	    path += '/';
	  }

	  return (isAbsolute ? '/' : '') + path;
	};

	// posix version
	exports.isAbsolute = function(path) {
	  return path.charAt(0) === '/';
	};

	// posix version
	exports.join = function() {
	  var paths = Array.prototype.slice.call(arguments, 0);
	  return exports.normalize(filter(paths, function(p, index) {
	    if (typeof p !== 'string') {
	      throw new TypeError('Arguments to path.join must be strings');
	    }
	    return p;
	  }).join('/'));
	};


	// path.relative(from, to)
	// posix version
	exports.relative = function(from, to) {
	  from = exports.resolve(from).substr(1);
	  to = exports.resolve(to).substr(1);

	  function trim(arr) {
	    var start = 0;
	    for (; start < arr.length; start++) {
	      if (arr[start] !== '') break;
	    }

	    var end = arr.length - 1;
	    for (; end >= 0; end--) {
	      if (arr[end] !== '') break;
	    }

	    if (start > end) return [];
	    return arr.slice(start, end - start + 1);
	  }

	  var fromParts = trim(from.split('/'));
	  var toParts = trim(to.split('/'));

	  var length = Math.min(fromParts.length, toParts.length);
	  var samePartsLength = length;
	  for (var i = 0; i < length; i++) {
	    if (fromParts[i] !== toParts[i]) {
	      samePartsLength = i;
	      break;
	    }
	  }

	  var outputParts = [];
	  for (var i = samePartsLength; i < fromParts.length; i++) {
	    outputParts.push('..');
	  }

	  outputParts = outputParts.concat(toParts.slice(samePartsLength));

	  return outputParts.join('/');
	};

	exports.sep = '/';
	exports.delimiter = ':';

	exports.dirname = function(path) {
	  var result = splitPath(path),
	      root = result[0],
	      dir = result[1];

	  if (!root && !dir) {
	    // No dirname whatsoever
	    return '.';
	  }

	  if (dir) {
	    // It has a dirname, strip trailing slash
	    dir = dir.substr(0, dir.length - 1);
	  }

	  return root + dir;
	};


	exports.basename = function(path, ext) {
	  var f = splitPath(path)[2];
	  // TODO: make this comparison case-insensitive on windows?
	  if (ext && f.substr(-1 * ext.length) === ext) {
	    f = f.substr(0, f.length - ext.length);
	  }
	  return f;
	};


	exports.extname = function(path) {
	  return splitPath(path)[3];
	};

	function filter (xs, f) {
	    if (xs.filter) return xs.filter(f);
	    var res = [];
	    for (var i = 0; i < xs.length; i++) {
	        if (f(xs[i], i, xs)) res.push(xs[i]);
	    }
	    return res;
	}

	// String.prototype.substr - negative index don't work in IE8
	var substr = 'ab'.substr(-1) === 'b'
	    ? function (str, start, len) { return str.substr(start, len) }
	    : function (str, start, len) {
	        if (start < 0) start = str.length + start;
	        return str.substr(start, len);
	    }
	;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5)))

/***/ },
/* 5 */
/***/ function(module, exports) {

	// shim for using process in browser

	var process = module.exports = {};
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = setTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    clearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        setTimeout(drainQueue, 0);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ }
/******/ ]);