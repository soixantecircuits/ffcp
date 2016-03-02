'use strict'

const CONSTANTS = {
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
}

class Resizer {
  constructor() {
    this.options = {
      scale       : 'best-fill',
      align       : 'center',
      force_style : true,
      parse       : true,
      target      : document.body,
      auto_resize : true,
      classes     : {
        to_resize : 'do-container',
        content   : 'do-content'
      }
    }
    // Set up
    this.elements = []

    // Parse
    if(this.options.parse)
      this.parse()

    // Auto resize
    if(this.options.auto_resize)
      this.initAutoResize()
  }

  initAutoResize() {
    //TODO: Implement auto-resize
    let that = this

    this.resizeAll()

    return this
  }

  parse(target, selector) {
    // Default options
    target   = target   || this.options.target
    selector = selector || this.options.classes.to_resize

    this.elements = []
    this.cachedElements = []
    let containers = target.querySelectorAll('.' + selector)

    for(let i = 0, len = containers.length; i < len; i++) {
      let container = containers[i],
        content   = container.querySelector('.' + this.options.classes.content)

      if(content) {
        this.elements.push({
            container : container,
            content   : content
          })
        this.cachedElements.push({
          container: {
            width: container.width,
            height: container.height
          },
          content: {
            width: content.width,
            height: content.height
          }
        })
      }
    }
    return this
  }

  resizeAll(options) {
    for(let i = 0, len = this.elements.length; i < len; i++) {
      let element = this.elements[i]
      let cache = this.cachedElements[i]
      Object.assign(element.content, cache.content)
      Object.assign(element.container, cache.container)
      this.resize(element.container, element.content, options)
    }
    return this
  }

  resize(container, content, options) {
    // Errors
    let errors = []

    if(!( container instanceof HTMLElement))
      errors.push('wrong container parameter')

    if(!(content instanceof HTMLElement))
      errors.push('wrong content parameter')

    if(errors.length)
    {
      for(let i = 0; i < errors.length; i++)
        console.warn(errors[i])

      return false
    }

    // Parameters
    let parameters = {}
    options = options ? options : {}
    parameters.container_width  = options.containerWidth || container.getAttribute('data-width')  || container.getAttribute('width')  || container.offsetWidth
    parameters.container_height = options.containerHeight || container.getAttribute('data-height') || container.getAttribute('height') || container.offsetHeight
    parameters.content_width    = options.contentWidth || content.getAttribute('data-width')    || content.getAttribute('width')    || content.offsetWidth
    parameters.content_height   = options.contentHeight || content.getAttribute('data-height')   || content.getAttribute('height')   || content.offsetHeight
    parameters.align = {
      x: options.align_x || content.getAttribute('data-align-x'),
      y: options.align_y || content.getAttribute('data-align-y')
    }
    parameters.scale            = options.scale || content.getAttribute('data-scale')

    //let sizes = this.getSizes(parameters)
    //
    //if(!sizes)
    //  return false

    options.force_style = !!options.force_style

    if(options.force_style) {
      let container_style = window.getComputedStyle(container),
        content_style   = window.getComputedStyle(content)

      if(container_style.position !== 'fixed' && container_style.position !== 'relative' && container_style.position !== 'absolute')
        container.style.position = 'relative'

      if(content_style.position !== 'fixed' && content_style.position !== 'relative' && content_style.position !== 'absolute')
        content.style.position = 'absolute'

      if(container_style.overflow !== 'hidden')
        container.style.overflow = 'hidden'
    }

    let dest = {}
    dest.width = parameters.container_width
    dest.height = parameters.container_height

    let source = {}
    source.width = parameters.content_width
    source.height = parameters.content_height

    let layout = this._innerFrameForSize(parameters.scale, parameters.align, source, dest)

    content.style.position = 'relative'
    content.style.top = layout.y+'px'
    content.style.left = layout.x+'px'
    content.style.width = layout.width+'px'
    content.style.height = layout.height+'px'
    content.style.maxWidth = 'none'
    content.style.margin = 0
    content.style.display = 'block'

    return this
  }

  getSizes(parameters, format) {
    let errors = []

    if(typeof parameters.content_width === 'undefined' || parseInt(parameters.content_width, 10) === 0)
      errors.push('content width must be specified')

    if(typeof parameters.content_height === 'undefined' || parseInt(parameters.content_height, 10) === 0)
      errors.push('content height must be specified')

    if(typeof parameters.container_width === 'undefined' || parseInt(parameters.container_width, 10) === 0)
      errors.push('container width must be specified')

    if(typeof parameters.container_height === 'undefined' || parseInt(parameters.container_height, 10) === 0)
      errors.push('container height must be specified')

    if(errors.length)
      return false

    if(typeof format === 'undefined')
      format = 'both'

    // Defaults parameters
    parameters.fit_type = parameters.fit_type || 'fill'
    parameters.align_x  = parameters.align_x  || 'center'
    parameters.align_y  = parameters.align_y  || 'center'
    parameters.rounding = parameters.rounding || 'ceil'

    let content_ratio   = parameters.content_width / parameters.content_height,
      container_ratio = parameters.container_width / parameters.container_height,
      width           = 0,
      height          = 0,
      x               = 0,
      y               = 0,
      fit_in          = null

    parameters.fit_type = parameters.fit_type.toLowerCase()
    parameters.align_x  = parameters.align_x.toLowerCase()
    parameters.align_y  = parameters.align_y.toLowerCase()
    parameters.rounding = parameters.rounding.toLowerCase()

    if(typeof parameters.align_x === 'undefined' || ['left', 'center', 'middle', 'right'].indexOf(parameters.align_x) === -1)
      parameters.align_x = 'center'
    if(typeof parameters.align_y === 'undefined' || ['top', 'center', 'middle', 'bottom'].indexOf(parameters.align_y) === -1)
      parameters.align_y = 'center'

    // Rounding
    if(['ceil', 'floor', 'round' ].indexOf(parameters.rounding)!== -1)
    {
      width  = Math[parameters.rounding].call(this,width)
      height = Math[parameters.rounding].call(this,height)
      x      = Math[parameters.rounding].call(this,x)
      y      = Math[parameters.rounding].call(this,y)
    }

    let sizes = {}

    sizes.cartesian        = {}
    sizes.cartesian.width  = width
    sizes.cartesian.height = height
    sizes.cartesian.x      = x
    sizes.cartesian.y      = y

    sizes.css        = {}
    sizes.css.width  = width + 'px'
    sizes.css.height = height + 'px'
    sizes.css.left   = x + 'px'
    sizes.css.top    = y + 'px'

    sizes.fit_in = fit_in

    if(format === 'both')
      return sizes
    else if(format === 'cartesian')
      return sizes.cartesian
    else if(format === 'css')
      return sizes.css
  }

  _innerFrameForSize(scale, align, source, dest){

    let scaleX, scaleY, result, scaleFactor

    result = { x: 0, y: 0, width: dest.width, height: dest.height }
    if (scale === CONSTANTS.FILL) return result

    scaleX = dest.width / source.width
    scaleY = dest.height / source.height

    switch (scale) {
      case CONSTANTS.BEST_FIT_DOWN_ONLY:
        if ((source.width > dest.width) || (source.height > dest.height)) {
          scaleFactor = scaleX < scaleY ? scaleX : scaleY
        } else {
          scaleFactor = 1.0
        }
        break
      case CONSTANTS.BEST_FIT:
        scaleFactor = scaleX < scaleY ? scaleX : scaleY
        break
      case CONSTANTS.NONE:
        scaleFactor = 1.0
        break
      case CONSTANTS.BEST_FILL:
      default:
        scaleFactor = scaleX > scaleY ? scaleX : scaleY
        break
    }

    result.width = Math.round(source.width * scaleFactor)
    result.height = Math.round(source.height * scaleFactor)

    switch(align.x) {
      case 'left':
        result.x = 0;
        break

      case 'middle':
      case 'center':
        result.x = (dest.width - result.width) / 2
        break

      case 'right':
        result.x = dest.width - result.width
        break
    }

    switch(align.y) {
      case 'top':
        result.y = 0;
        break
      case 'middle':
      case 'center':
        result.y = (dest.height - result.height) / 2
        break
      case 'bottom':
        result.y = dest.height - result.height
        break
    }

    return result

  }
}
module.exports = Resizer
