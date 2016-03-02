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
  ALIGN_BOTTOM: 'bottom'
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
      rounding    : 'ceil',
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
    let self = this
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
        content.style.display = 'none'
        ;(function waitTillContentReady(container, content, index) {
          content.onload = function() {
            content.style.display = 'block'
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
          }
        })(container, content, i)
      }
    }
    return this
  }

  resizeAll(options) {
    for(let i = 0, len = this.elements.length; i < len; i++) {
      let element = this.elements[i]
      if(this.cachedElements[i]) {
        let cache = this.cachedElements[i]
        Object.assign(element.content, cache.content)
        Object.assign(element.container, cache.container)
        this.resize(element.container, element.content, options)
      }
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
    parameters.scale            = options.scale || content.getAttribute('data-scale')
    parameters.rounding         = options.rounding || content.getAttribute('data-rounding')
    parameters.align = {
      x: options.align_x || content.getAttribute('data-align-x'),
      y: options.align_y || content.getAttribute('data-align-y')
    }

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

    if(['ceil', 'floor', 'round'].indexOf(parameters.rounding)!== -1)
    {
      layout.width  = Math[parameters.rounding].call(this, layout.width)
      layout.height = Math[parameters.rounding].call(this, layout.height)
      layout.x      = Math[parameters.rounding].call(this, layout.x)
      layout.y      = Math[parameters.rounding].call(this, layout.y)
    }

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
