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

	module.exports = __webpack_require__(1);


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

/***/ }
/******/ ]);