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

	var resizer = __webpack_require__(2);

	var instance = new resizer();

	var buttons = document.getElementsByTagName('input');
	function handleClick(e) {
	  var options = {
	    scale: e.srcElement.value
	  };
	  instance.resizeAll(options);
	}
	Array.prototype.forEach.call(buttons, function (button) {
	  button.onclick = handleClick;
	});

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var CONSTANTS = {
	  NONE: 'none',
	  FILL: 'fill',
	  BEST_FILL: 'best-fill',
	  BEST_FIT: 'best-fit',
	  BEST_FIT_DOWN_ONLY: 'best-fit-down',
	  ALIGN_LEFT: 'left',
	  ALIGN_RIGHT: 'right',
	  ALIGN_CENTER: 'center',
	  ALIGN_TOP: 'top',
	  ALIGN_BOTTOM: 'bottom',
	  ALIGN_TOP_LEFT: 'top-left',
	  ALIGN_TOP_RIGHT: 'top-right',
	  ALIGN_BOTTOM_LEFT: 'bottom-left',
	  ALIGN_BOTTOM_RIGHT: 'bottom-right'
	};

	var Resizer = function () {
	  function Resizer() {
	    _classCallCheck(this, Resizer);

	    this.options = {
	      scale: 'best-fill',
	      align: 'center',
	      force_style: true,
	      parse: true,
	      target: document.body,
	      auto_resize: true,
	      classes: {
	        to_resize: 'do-container',
	        content: 'do-content'
	      }
	    };
	    // Set up
	    this.elements = [];

	    // Parse
	    if (this.options.parse) this.parse();

	    // Auto resize
	    if (this.options.auto_resize) this.initAutoResize();
	  }

	  _createClass(Resizer, [{
	    key: 'initAutoResize',
	    value: function initAutoResize() {
	      //TODO: Implement auto-resize
	      var that = this;

	      this.resizeAll();

	      return this;
	    }
	  }, {
	    key: 'parse',
	    value: function parse(target, selector) {
	      // Default options
	      target = target || this.options.target;
	      selector = selector || this.options.classes.to_resize;

	      this.elements = [];
	      this.cachedElements = [];
	      var containers = target.querySelectorAll('.' + selector);

	      for (var i = 0, len = containers.length; i < len; i++) {
	        var container = containers[i],
	            content = container.querySelector('.' + this.options.classes.content);

	        if (content) {
	          this.elements.push({
	            container: container,
	            content: content
	          });
	          this.cachedElements.push({
	            container: {
	              width: container.width,
	              height: container.height
	            },
	            content: {
	              width: content.width,
	              height: content.height
	            }
	          });
	        }
	      }
	      return this;
	    }
	  }, {
	    key: 'resizeAll',
	    value: function resizeAll(options) {
	      for (var i = 0, len = this.elements.length; i < len; i++) {
	        var element = this.elements[i];
	        var cache = this.cachedElements[i];
	        Object.assign(element.content, cache.content);
	        Object.assign(element.container, cache.container);
	        this.resize(element.container, element.content, options);
	      }
	      return this;
	    }
	  }, {
	    key: 'resize',
	    value: function resize(container, content, options) {
	      // Errors
	      var errors = [];

	      if (!(container instanceof HTMLElement)) errors.push('wrong container parameter');

	      if (!(content instanceof HTMLElement)) errors.push('wrong content parameter');

	      if (errors.length) {
	        for (var i = 0; i < errors.length; i++) {
	          console.warn(errors[i]);
	        }return false;
	      }

	      // Parameters
	      var parameters = {};
	      options = options ? options : {};
	      parameters.container_width = options.containerWidth || container.getAttribute('data-width') || container.getAttribute('width') || container.offsetWidth;
	      parameters.container_height = options.containerHeight || container.getAttribute('data-height') || container.getAttribute('height') || container.offsetHeight;
	      parameters.content_width = options.contentWidth || content.getAttribute('data-width') || content.getAttribute('width') || content.offsetWidth;
	      parameters.content_height = options.contentHeight || content.getAttribute('data-height') || content.getAttribute('height') || content.offsetHeight;
	      parameters.align = options.align || content.getAttribute('data-align');
	      parameters.scale = options.scale || content.getAttribute('data-scale');

	      //let sizes = this.getSizes(parameters)
	      //
	      //if(!sizes)
	      //  return false

	      options.force_style = !!options.force_style;

	      if (options.force_style) {
	        var container_style = window.getComputedStyle(container),
	            content_style = window.getComputedStyle(content);

	        if (container_style.position !== 'fixed' && container_style.position !== 'relative' && container_style.position !== 'absolute') container.style.position = 'relative';

	        if (content_style.position !== 'fixed' && content_style.position !== 'relative' && content_style.position !== 'absolute') content.style.position = 'absolute';

	        if (container_style.overflow !== 'hidden') container.style.overflow = 'hidden';
	      }

	      //content.style.top    = sizes.css.top
	      //content.style.left   = sizes.css.left
	      //content.style.width  = sizes.css.width
	      //content.style.height = sizes.css.height

	      var dest = {};
	      dest.width = parameters.container_width;
	      dest.height = parameters.container_height;

	      var source = {};
	      source.width = parameters.content_width;
	      source.height = parameters.content_height;

	      var layout = this._innerFrameForSize(parameters.scale, parameters.align, source, dest);

	      content.style.position = 'relative';
	      //content.style.top = layout.y+'px'
	      //content.style.left = layout.x+'px'
	      content.style.width = layout.width + 'px';
	      content.style.height = layout.height + 'px';
	      content.style.maxWidth = 'none';
	      content.style.margin = 0;
	      content.style.display = 'block';

	      return this;
	    }
	  }, {
	    key: 'getSizes',
	    value: function getSizes(parameters, format) {
	      var errors = [];

	      if (typeof parameters.content_width === 'undefined' || parseInt(parameters.content_width, 10) === 0) errors.push('content width must be specified');

	      if (typeof parameters.content_height === 'undefined' || parseInt(parameters.content_height, 10) === 0) errors.push('content height must be specified');

	      if (typeof parameters.container_width === 'undefined' || parseInt(parameters.container_width, 10) === 0) errors.push('container width must be specified');

	      if (typeof parameters.container_height === 'undefined' || parseInt(parameters.container_height, 10) === 0) errors.push('container height must be specified');

	      if (errors.length) return false;

	      if (typeof format === 'undefined') format = 'both';

	      // Defaults parameters
	      parameters.fit_type = parameters.fit_type || 'fill';
	      parameters.align_x = parameters.align_x || 'center';
	      parameters.align_y = parameters.align_y || 'center';
	      parameters.rounding = parameters.rounding || 'ceil';

	      var content_ratio = parameters.content_width / parameters.content_height,
	          container_ratio = parameters.container_width / parameters.container_height,
	          width = 0,
	          height = 0,
	          x = 0,
	          y = 0,
	          fit_in = null;

	      parameters.fit_type = parameters.fit_type.toLowerCase();
	      parameters.align_x = parameters.align_x.toLowerCase();
	      parameters.align_y = parameters.align_y.toLowerCase();
	      parameters.rounding = parameters.rounding.toLowerCase();

	      if (typeof parameters.align_x === 'undefined' || ['left', 'center', 'middle', 'right'].indexOf(parameters.align_x) === -1) parameters.align_x = 'center';
	      if (typeof parameters.align_y === 'undefined' || ['top', 'center', 'middle', 'bottom'].indexOf(parameters.align_y) === -1) parameters.align_y = 'center';

	      var setFullWidth = function setFullWidth() {
	        width = parameters.container_width;
	        height = parameters.container_width / parameters.content_width * parameters.content_height;
	        x = 0;
	        fit_in = 'width';

	        switch (parameters.align_y) {
	          case 'top':
	            y = 0;
	            break;

	          case 'middle':
	          case 'center':
	            y = (parameters.container_height - height) / 2;
	            break;

	          case 'bottom':
	            y = parameters.container_height - height;
	            break;
	        }
	      };
	      var setFullHeight = function setFullHeight() {
	        height = parameters.container_height;
	        width = parameters.container_height / parameters.content_height * parameters.content_width;
	        y = 0;
	        fit_in = 'height';

	        switch (parameters.align_x) {
	          case 'left':
	            x = 0;
	            break;

	          case 'middle':
	          case 'center':
	            x = (parameters.container_width - width) / 2;
	            break;

	          case 'right':
	            x = parameters.container_width - width;
	            break;
	        }
	      };

	      // Content should fill the container
	      if (['fill', 'full', 'cover'].indexOf(parameters.fit_type) !== -1) {
	        if (content_ratio < container_ratio) setFullWidth();else setFullHeight();
	      }

	      // Content should fit in the container
	      else if (['fit', 'i sits', 'contain'].indexOf(parameters.fit_type) !== -1) {
	          if (content_ratio < container_ratio) setFullHeight();else setFullWidth();
	        }

	      // Rounding
	      if (['ceil', 'floor', 'round'].indexOf(parameters.rounding) !== -1) {
	        width = Math[parameters.rounding].call(this, width);
	        height = Math[parameters.rounding].call(this, height);
	        x = Math[parameters.rounding].call(this, x);
	        y = Math[parameters.rounding].call(this, y);
	      }

	      var sizes = {};

	      sizes.cartesian = {};
	      sizes.cartesian.width = width;
	      sizes.cartesian.height = height;
	      sizes.cartesian.x = x;
	      sizes.cartesian.y = y;

	      sizes.css = {};
	      sizes.css.width = width + 'px';
	      sizes.css.height = height + 'px';
	      sizes.css.left = x + 'px';
	      sizes.css.top = y + 'px';

	      sizes.fit_in = fit_in;

	      if (format === 'both') return sizes;else if (format === 'cartesian') return sizes.cartesian;else if (format === 'css') return sizes.css;
	    }
	  }, {
	    key: '_innerFrameForSize',
	    value: function _innerFrameForSize(scale, align, source, dest) {

	      var scaleX = undefined,
	          scaleY = undefined,
	          result = undefined,
	          scaleFactor = undefined;

	      result = { x: 0, y: 0, width: dest.width, height: dest.height };
	      if (scale === CONSTANTS.FILL) return result;

	      scaleX = dest.width / source.width;
	      scaleY = dest.height / source.height;

	      switch (scale) {
	        case CONSTANTS.BEST_FIT_DOWN_ONLY:
	          if (source.width > dest.width || source.height > dest.height) {
	            scaleFactor = scaleX < scaleY ? scaleX : scaleY;
	          } else {
	            scaleFactor = 1.0;
	          }
	          break;
	        case CONSTANTS.BEST_FIT:
	          scaleFactor = scaleX < scaleY ? scaleX : scaleY;
	          break;
	        case CONSTANTS.NONE:
	          scaleFactor = 1.0;
	          break;
	        case CONSTANTS.BEST_FILL:
	        default:
	          scaleFactor = scaleX > scaleY ? scaleX : scaleY;
	          break;
	      }

	      result.width = Math.round(source.width * scaleFactor);
	      result.height = Math.round(source.height * scaleFactor);

	      switch (align) {
	        case this.ALIGN_LEFT:
	          result.x = 0;
	          result.y = dest.height / 2 - source.height / 2;
	          break;
	        case this.ALIGN_RIGHT:
	          result.x = -source.width;
	          result.y = dest.height / 2 - source.height / 2;
	          break;
	        case this.ALIGN_TOP:
	          result.x = dest.width / 2 - source.width / 2;
	          result.y = 0;
	          break;
	        case this.ALIGN_BOTTOM:
	          result.x = dest.width / 2 - source.width / 2;
	          result.y = dest.height - source.height;
	          break;
	        case this.ALIGN_TOP_LEFT:
	          result.x = 0;
	          result.y = 0;
	          break;
	        case this.ALIGN_TOP_RIGHT:
	          result.x = dest.width - source.width;
	          result.y = 0;
	          break;
	        case this.ALIGN_BOTTOM_LEFT:
	          result.x = 0;
	          result.y = dest.height - source.height;
	          break;
	        case this.ALIGN_BOTTOM_RIGHT:
	          result.x = dest.width - source.width;
	          result.y = dest.height - source.height;
	          break;
	        default:
	          // this.ALIGN_CENTER
	          result.x = dest.width / 2 - source.width / 2;
	          result.y = dest.height / 2 - source.height / 2;
	      }

	      return result;
	    }
	  }]);

	  return Resizer;
	}();

	module.exports = Resizer;

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