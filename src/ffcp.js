module.exports = (function() {
  'use strict'
  let Resizer = {}

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

  const DEFAULT_OPTIONS = {
    scale      : FITS.BEST_FILL,
    alignX     : ALIGNS.CENTER,
    alignY     : ALIGNS.CENTER,
    forceStyle : true,
    //target     : document.body,
    autoResize : true,
    rounding   : 'ceil',
    selectors  : {
      container: '.ffcp-container',
      image    : '.ffcp-image'
    }
  }

  Resizer.resize = (container, image, options) => {
    let errors = []

    if (!( container instanceof HTMLElement)) errors.push('wrong container parameter')
    if (!(image instanceof HTMLElement)) errors.push('wrong image parameter')
    if (errors.length) {
      errors.forEach((err) => console.warn(err))
      return
    }
    _waitTillContentReady(image)
      .then(() => {
        if (image.cache) {
          if (image.cache.src === image.src) {
            Object.assign(image, image.cache)
          } else {
            _srcChanged(image, container, options)
            return
          }
        } else image.cache = {
          width: image.width,
          height: image.height,
          src: image.src
        }
        let parameters = _getImageParameters(image, container, options || {})

        if (!!options.forceStyle) _forceStyle(image, container)
        let dest = {}
        dest.width = parameters.containerWidth
        dest.height = parameters.containerHeight
        let source = {}
        source.width = parameters.imageWidth
        source.height = parameters.imageHeight

        let layout = _calculateLayout(parameters.scale, parameters.align, source, dest)

        if (['ceil', 'floor', 'round'].indexOf(parameters.rounding)!== -1) {
          _roundLayoutDimensions(layout, parameters.rounding)
        }
        _applyLayout(image.style, layout)
        _show(image)
      })
  }

  Resizer.resizeAll = (target, options) => {
    if (!( target instanceof HTMLElement)) {
      console.warn('wrong target parameter')
      return
    }

    let opts = Object.assign({}, DEFAULT_OPTIONS, options)
      , pairs = _parse(target, opts.selectors.container, opts.selectors.image)
    pairs.forEach((pair) => Resizer.resize(pair.container, pair.image, opts))
  }

  function _forceStyle(image, container) {
    let containerStyle = window.getComputedStyle(container),
      imageStyle   = window.getComputedStyle(image)

    if(containerStyle.position !== 'fixed' && containerStyle.position !== 'relative'
      && containerStyle.position !== 'absolute') {
      container.style.position = 'relative'
    }
    if(imageStyle.position !== 'fixed' && imageStyle.position !== 'relative' && imageStyle.position !== 'absolute') {
      image.style.position = 'absolute'
    }
    if(containerStyle.overflow !== 'hidden') container.style.overflow = 'hidden'
  }

  function _getImageParameters (image, container, options) {
    let params = {}
    params.containerWidth = options.containerWidth || container.dataset.width ||
      container.getAttribute('width') || container.offsetWidth
    params.containerHeight = options.containerHeight || container.dataset.heigh ||
      container.getAttribute('height') || container.offsetHeight
    params.imageWidth = options.imageWidth || image.dataset.width ||
      image.getAttribute('width') || image.offsetWidth
    params.imageHeight = options.imageHeight || image.dataset.height ||
      image.getAttribute('height') || image.offsetHeight
    params.scale = options.scale || image.dataset.scale
    params.rounding = options.rounding || image.dataset.rounding
    params.align = {
      x: options.alignX || image.dataset['align-x'],
      y: options.alignY || image.dataset['align-y']
    }
    return params
  }

  function _applyLayout (targetImageStyle, layout) {
    targetImageStyle.position = 'relative'
    targetImageStyle.top = layout.y + 'px'
    targetImageStyle.left = layout.x + 'px'
    targetImageStyle.width = layout.width + 'px'
    targetImageStyle.height = layout.height + 'px'
    targetImageStyle.maxWidth = 'none'
    targetImageStyle.margin = 0
  }

  function _roundLayoutDimensions (layout, rounding) {
    layout.width  = Math[rounding](layout.width)
    layout.height = Math[rounding](layout.height)
    layout.x      = Math[rounding](layout.x)
    layout.y      = Math[rounding](layout.y)
  }

  function _parse (target, containerSelector, imageSelector) {
    let containers = target.querySelectorAll(containerSelector)
      , pairs = []

      ;[].forEach.call(containers, (container, i) => {
      let image = container.querySelector(imageSelector)
      if (image) {
        pairs.push({container, image})
      } else {
        console.warn('Failed to find an image in your container.')
      }
    })

    return pairs
  }

  function _waitTillContentReady (image) {
    return new Promise((resolve) => {
      image.onload = function () {
        resolve()
        _show(image)
        image.onload = null
      }
      image.src = image.src
    })
  }

  function _srcChanged (image, container, options) {
    let tmpImage = document.createElement('img') // in-memory image for getting real image size
    tmpImage.onload = () => {
      image.cache.src = tmpImage.src
      image.cache.width = tmpImage.width
      image.cache.height = tmpImage.height
      Resizer.resize(container, image, options) // resize again after new image is loaded. May be not the best solution
      _show(image)
    }
    tmpImage.src = image.src
    _hide(image)
  }

  function _hide (element) { element.style.display = 'none' }

  function _show (element) { element.style.display = 'block'}

  function _calculateLayout (fit, align, source, dest) {
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

  Resizer.ALIGNS = ALIGNS
  Resizer.FITS = FITS

  return Resizer
})()