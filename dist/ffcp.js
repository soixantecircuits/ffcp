(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["ffcp"] = factory();
	else
		root["ffcp"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
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
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
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
	
	/**
	 * Resizer class for image scaling
	 * @public
	 * @class
	 * */
	
	var Resizer = function () {
	  function Resizer(options) {
	    _classCallCheck(this, Resizer);
	
	    // setting default options
	    this.options = {
	      scale: FITS.BEST_FILL,
	      alignX: ALIGNS.CENTER,
	      alignY: ALIGNS.CENTER,
	      forceStyle: true,
	      target: document.body,
	      autoResize: true,
	      rounding: 'ceil',
	      selectors: {
	        container: '.do-container',
	        content: '.do-content'
	      }
	    };
	    Object.assign(this.options, options);
	    // Set up
	    this.elements = [];
	
	    this._parse();
	
	    if (this.options.auto_resize) window.addEventListener('resize', this.resizeAll.bind(this));
	
	    this.resizeAll();
	  }
	
	  /**
	   * @public
	   * Method used to resize all images in container specified in constructor
	   * @param {Object} options
	   * @return {Resizer} this for method chaining
	   * */
	
	
	  _createClass(Resizer, [{
	    key: 'resizeAll',
	    value: function resizeAll(options) {
	      var self = this;[].forEach.call(this.elements, function (element, i) {
	        if (self.cachedElements[i]) {
	          var cache = self.cachedElements[i];
	          Object.assign(element.content, cache.content);
	          Object.assign(element.container, cache.container);
	          self.resize(element.container, element.content, options);
	        }
	      });
	      return this;
	    }
	
	    /**
	     * @public
	     * Method used to resize specified content in a specified container
	     * @param {HTMLElement} container
	     * @param {HTMLElement} content
	     * @param {Object} options
	     * @return {Resizer} this for method chaining
	     * */
	
	  }, {
	    key: 'resize',
	    value: function resize(container, content, options) {
	      var errors = [];
	
	      if (!(container instanceof HTMLElement)) errors.push('wrong container parameter');
	      if (!(content instanceof HTMLElement)) errors.push('wrong content parameter');
	
	      if (errors.length) {
	        errors.forEach(function (err) {
	          return console.warn(err);
	        });
	        return false;
	      }
	
	      if (container.cache) Object.assign(container, container.cache);else container.cache = {
	        width: container.width,
	        height: container.height
	      };
	      if (content.cache) {
	        if (content.cache.src === content.src) {
	          Object.assign(content, content.cache);
	        } else {
	          (function () {
	            var tmpImage = document.createElement('img');
	            tmpImage.onload = function () {
	              content.cache.src = tmpImage.src;
	              content.cache.width = tmpImage.width;
	              content.cache.height = tmpImage.height;
	            };
	            tmpImage.src = content.src;
	          })();
	        }
	      } else content.cache = {
	        width: content.width,
	        height: content.height
	      };
	
	      // Parameters
	      var parameters = {};
	      options = options ? options : {};
	      parameters.containerWidth = options.containerWidth || container.getAttribute('data-width') || container.getAttribute('width') || container.offsetWidth;
	      parameters.containerHeight = options.containerHeight || container.getAttribute('data-height') || container.getAttribute('height') || container.offsetHeight;
	      parameters.contentWidth = options.contentWidth || content.getAttribute('data-width') || content.getAttribute('width') || content.offsetWidth;
	      parameters.contentHeight = options.contentHeight || content.getAttribute('data-height') || content.getAttribute('height') || content.offsetHeight;
	      parameters.scale = options.scale || content.getAttribute('data-scale');
	      parameters.rounding = options.rounding || content.getAttribute('data-rounding');
	      parameters.align = {
	        x: options.alignX || content.getAttribute('data-align-x'),
	        y: options.alignY || content.getAttribute('data-align-y')
	      };
	
	      if (!!options.forceStyle) {
	        var containerStyle = window.getComputedStyle(container),
	            contentStyle = window.getComputedStyle(content);
	
	        if (containerStyle.position !== 'fixed' && containerStyle.position !== 'relative' && containerStyle.position !== 'absolute') {
	          container.style.position = 'relative';
	        }
	
	        if (contentStyle.position !== 'fixed' && contentStyle.position !== 'relative' && contentStyle.position !== 'absolute') {
	          content.style.position = 'absolute';
	        }
	
	        if (containerStyle.overflow !== 'hidden') container.style.overflow = 'hidden';
	      }
	
	      var dest = {};
	      dest.width = parameters.containerWidth;
	      dest.height = parameters.containerHeight;
	
	      var source = {};
	      source.width = parameters.contentWidth;
	      source.height = parameters.contentHeight;
	
	      var layout = this._innerFrameForSize(parameters.scale, parameters.align, source, dest);
	
	      if (['ceil', 'floor', 'round'].indexOf(parameters.rounding) !== -1) {
	        layout.width = Math[parameters.rounding].call(this, layout.width);
	        layout.height = Math[parameters.rounding].call(this, layout.height);
	        layout.x = Math[parameters.rounding].call(this, layout.x);
	        layout.y = Math[parameters.rounding].call(this, layout.y);
	      }
	
	      content.style.position = 'relative';
	      content.style.top = layout.y + 'px';
	      content.style.left = layout.x + 'px';
	      content.style.width = layout.width + 'px';
	      content.style.height = layout.height + 'px';
	      content.style.maxWidth = 'none';
	      content.style.margin = 0;
	      content.style.display = 'block';
	
	      return this;
	    }
	
	    /**
	     * @private
	     * Utility function used to find all images to scale inside container specified in constructor
	     * */
	
	  }, {
	    key: '_parse',
	    value: function _parse() {
	      var self = this;
	      // Default options
	      var target = this.options.target;
	
	      this.elements = [];
	      this.cachedElements = [];
	      var containers = target.querySelectorAll(this.options.selectors.container);[].forEach.call(containers, function (container, i) {
	        var content = container.querySelector(self.options.selectors.content);
	        if (content) {
	          self.elements.push({
	            container: container,
	            content: content
	          });
	          content.style.display = 'none';(function waitTillContentReady(container, content, index) {
	            content.onload = function () {
	              content.style.display = 'block';
	              self.cachedElements[index] = {
	                container: {
	                  width: container.width,
	                  height: container.height
	                },
	                content: {
	                  width: content.width,
	                  height: content.height
	                }
	              };
	              self.resize(container, content);
	            };
	          })(container, content, i);
	        }
	      });
	    }
	
	    /**
	     * @private
	     * Utility function used to calculate layout
	     * @param {FITS} fit (one of enumeration values)
	     * @param {ALIGNS} align (one of enumeration values)
	     * @param {Object} source object with image width and height
	     * @param {Object} dest object with container width and height
	     * @return {Object} layout object with all calculated properties
	     * */
	
	  }, {
	    key: '_innerFrameForSize',
	    value: function _innerFrameForSize(fit, align, source, dest) {
	
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
	  }]);
	
	  return Resizer;
	}();
	
	module.exports = Resizer;

/***/ }
/******/ ])
});
;
//# sourceMappingURL=ffcp.js.map