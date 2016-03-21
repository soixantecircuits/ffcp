'use strict'

const ALIGNS = {
  LEFT: 'left',
  RIGHT: 'right',
  CENTER: 'center',
  MIDDLE: 'middle',
  TOP: 'top',
  BOTTOM: 'bottom'
}

const FITS = {
  NONE: 'none',
  FILL: 'fill',
  BEST_FILL: 'best-fill',
  BEST_FIT: 'best-fit',
  BEST_FIT_DOWN_ONLY: 'best-fit-down'
}

/**
 * Resizer class for image scaling
 * @public
 * @class
 * */
class Resizer {
  constructor(options) {
    // setting default options
    this.options = {
      scale      : FITS.BEST_FILL,
      alignX     : ALIGNS.CENTER,
      alignY     : ALIGNS.CENTER,
      forceStyle : true,
      target     : document.body,
      autoResize : true,
      rounding   : 'ceil',
      selectors  : {
        container: '.do-container',
        content  : '.do-content'
      }
    }
    Object.assign(this.options, options)
    // Set up
    this.elements = []

    this._parse()

    if (this.options.auto_resize) window.addEventListener('resize', this.resizeAll.bind(this))

  }

  /**
   * @public
   * Method used to resize all images in container specified in constructor
   * @param {Object} options
   * @return {Resizer} this for method chaining
   * */
  resizeAll(options) {
    let self = this
    ;[].forEach.call(this.elements, (element, i) => {
      if (self.cachedElements[i]) {
        let cache = self.cachedElements[i]
        Object.assign(element.content, cache.content)
        Object.assign(element.container, cache.container)
        self.resize(element.container, element.content, options)
      }
    })
    return this
  }

  /**
   * @public
   * Method used to resize specified content in a specified container
   * @param {HTMLElement} container
   * @param {HTMLElement} content
   * @param {Object} options
   * @return {Resizer} this for method chaining
   * */
  resize(container, content, options) {
    let self = this
    let errors = []

    if (!( container instanceof HTMLElement)) errors.push('wrong container parameter')
    if (!(content instanceof HTMLElement)) errors.push('wrong content parameter')

    if (errors.length) {
      errors.forEach((err) => console.warn(err))
      return false
    }

    if (content.cache) {
      if (content.cache.src === content.src) {
        Object.assign(content, content.cache)
      } else {
        let tmpImage = document.createElement('img')
        tmpImage.onload = () => {
          content.cache.src = tmpImage.src
          content.cache.width = tmpImage.width
          content.cache.height = tmpImage.height
          self.resize(container, content, options) // resize again after new image is loaded. May be not the best solution
        }
        tmpImage.src = content.src
      }
    } else content.cache = {
      width: content.width,
      height: content.height
    }

    let parameters = {}
    options = options ? options : {}
    parameters.containerWidth = options.containerWidth ||
                                container.getAttribute('data-width') ||
                                container.getAttribute('width') ||
                                container.offsetWidth
    parameters.containerHeight = options.containerHeight ||
                                 container.getAttribute('data-height') ||
                                 container.getAttribute('height') ||
                                 container.offsetHeight
    parameters.contentWidth = options.contentWidth ||
                              content.getAttribute('data-width') ||
                              content.getAttribute('width') ||
                              content.offsetWidth
    parameters.contentHeight = options.contentHeight ||
                               content.getAttribute('data-height') ||
                               content.getAttribute('height') ||
                               content.offsetHeight
    parameters.scale = options.scale ||
                       content.getAttribute('data-scale')
    parameters.rounding = options.rounding ||
                          content.getAttribute('data-rounding')
    parameters.align = {
      x: options.alignX || content.getAttribute('data-align-x'),
      y: options.alignY || content.getAttribute('data-align-y')
    }

    if (!!options.forceStyle) {
      let containerStyle = window.getComputedStyle(container),
        contentStyle   = window.getComputedStyle(content)

      if(containerStyle.position !== 'fixed' && containerStyle.position !== 'relative'
        && containerStyle.position !== 'absolute') {
        container.style.position = 'relative'
      }

      if(contentStyle.position !== 'fixed' && contentStyle.position !== 'relative' && contentStyle.position !== 'absolute') {
        content.style.position = 'absolute'
      }

      if(containerStyle.overflow !== 'hidden') container.style.overflow = 'hidden'
    }

    let dest = {}
    dest.width = parameters.containerWidth
    dest.height = parameters.containerHeight

    let source = {}
    source.width = parameters.contentWidth
    source.height = parameters.contentHeight

    let layout = this._innerFrameForSize(parameters.scale, parameters.align, source, dest)

    if (['ceil', 'floor', 'round'].indexOf(parameters.rounding)!== -1) {
      layout.width  = Math[parameters.rounding].call(this, layout.width)
      layout.height = Math[parameters.rounding].call(this, layout.height)
      layout.x      = Math[parameters.rounding].call(this, layout.x)
      layout.y      = Math[parameters.rounding].call(this, layout.y)
    }

    content.style.position = 'relative'
    content.style.top = layout.y + 'px'
    content.style.left = layout.x + 'px'
    content.style.width = layout.width + 'px'
    content.style.height = layout.height + 'px'
    content.style.maxWidth = 'none'
    content.style.margin = 0
    content.style.display = 'block'

    return this
  }

  /**
   * @private
   * Utility function used to find all images to scale inside container specified in constructor
   * */
  _parse() {
    let self = this
    // Default options
    let target = this.options.target

    this.elements = []
    this.cachedElements = []
    let containers = target.querySelectorAll(this.options.selectors.container)

      ;[].forEach.call(containers, (container, i) => {
      let content   = container.querySelector(self.options.selectors.content)
      if(content) {
        self.elements.push({
          container : container,
          content   : content
        })
        content.style.display = 'none'
        ;(function waitTillContentReady(container, content, index) {
          content.onload = function() {
            content.style.display = 'block'
            container.cache
            self.cachedElements[index] = {
              container: {
                width: container.width,
                height: container.height
              },
              content: {
                width: content.width,
                height: content.height
              }
            }
            self.resize(container, content)
            content.onload = null
          }
        })(container, content, i)
      }
    })
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
  _innerFrameForSize(fit, align, source, dest){

    let scaleX, scaleY, scaleFactor

    let result = { x: 0, y: 0, width: dest.width, height: dest.height }
    if (fit === FITS.FILL) return result

    scaleX = dest.width / source.width
    scaleY = dest.height / source.height

    switch (fit) {
      case FITS.BEST_FIT_DOWN_ONLY:
        if ((source.width > dest.width) || (source.height > dest.height)) {
          scaleFactor = scaleX < scaleY ? scaleX : scaleY
        } else {
          scaleFactor = 1.0
        }
        break
      case FITS.BEST_FIT:
        scaleFactor = scaleX < scaleY ? scaleX : scaleY
        break
      case FITS.NONE:
        scaleFactor = 1.0
        break
      case FITS.BEST_FILL:
      default:
        scaleFactor = scaleX > scaleY ? scaleX : scaleY
        break
    }

    result.width = Math.round(source.width * scaleFactor)
    result.height = Math.round(source.height * scaleFactor)

    switch(align.x) {
      case ALIGNS.LEFT:
        result.x = 0
        break
      case ALIGNS.RIGHT:
        result.x = dest.width - result.width
        break
      case ALIGNS.MIDDLE:
      case ALIGNS.CENTER:
        result.x = (dest.width - result.width) / 2
        break
    }

    switch(align.y) {
      case ALIGNS.TOP:
        result.y = 0
        break
      case ALIGNS.BOTTOM:
        result.y = dest.height - result.height
        break
      case ALIGNS.MIDDLE:
      case ALIGNS.CENTER:
        result.y = (dest.height - result.height) / 2
        break
    }

    return result
  }
}

module.exports = Resizer