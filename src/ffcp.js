'use strict'

const DEFAULT_OPTIONS = {
  scale: 'best-fill',
  align: 'center',
  parent: null,
  hideParentOverflow: true,
  rescaleOnResize: false,
  logLevel: 0
}

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

class ImageScale{
  constructor(element, options){
    let self = this

    this.options = Object.assign({}, DEFAULT_OPTIONS, options)
    this.element = element

    this.img = element.tagName === 'IMG' ? element : element.querySelector('img')
    this.cache = {
      width: this.img.width,
      height: this.img.height
    }
    this.src = this.img.getAttribute('src')

    this.imgWidth = this.img.naturalWidth || this.img.width
    this.imgHeight = this.img.naturalHeight || this.img.height

    this.parent = this.options.parent ? this.options.parent : element.parentNode

    if (this.options.hideParentOverflow) {
      this.parent.style.overflow = 'hidden'
    }

    this._canScale = true

    // Fixes: https://github.com/gestixi/image-scale/issues/1
    if (this.parent.style.position === 'static') {
      this.parent.style.position = 'relative'
    }

    if (this.options.rescaleOnResize) {
      window.onresize = () => { self.scheduleScale() }
    }
  }

  scheduleScale(){
    if (this._didScheduleScale) return

    if (window.requestAnimationFrame) {
      let self = this
      this._didScheduleScale = true
      // setTimeout important when resizing down if the scrollbar were visible
      requestAnimationFrame(() => {
        setTimeout(() => {
        self.scale()
        this._didScheduleScale = false
      }, 0)
    })
    } else {
      this.scale()
    }

  }

  scale(options, callback){
    let self = this

    Object.assign(this.img.style, this.cache)

    if (!this._canScale) return //TODO: take a look later

    this.options = Object.assign({}, DEFAULT_OPTIONS, options)

    this.src = this.img.getAttribute('src')

    if (this.options.rescaleOnResize) {
      if (!this._needUpdate(this.parent)) return;
    }

    let transition = this.options.transition //func?

    if (transition) {
      this._canScale = false;
      this.element.style.transition = 'all '+ transition +'ms'

      setTimeout(function() {
        self._canScale = true
        this.element.style.transition = 'null'
      }, transition);
    }

    let dest = {}
    dest.width = this.options.destWidth
      ? this.options.destWidth
      : this.parent.offsetWidth
    dest.height = this.options.destHeight
      ? this.options.destHeight
      : this.parent.offsetHeight

    dest.innerWidth = this.options.destWidth
      ? this.options.destWidth
      : this.parent.clientWidth
    dest.innerHeight = this.options.destHeight
      ? this.options.destHeight
      : this.parent.clientHeight

    let widthOffset = dest.width - dest.innerWidth,
      heightOffset = dest.height - dest.innerHeight

    if (!this.options.scale) {
      if (this.options.logLevel > 2) {
        console.log('imageScale - DEBUG NOTICE: The scale property is null.', this.element)
      }
      return
    }

    let source = {
      width: this.img.width,
      height: this.img.height
    }

    let layout = this._innerFrameForSize(options.scale, options.align, source, dest)

    if (widthOffset) layout.x -= widthOffset/2
    if (heightOffset) layout.y -= heightOffset/2

    this.element.style.position = 'relative'
    this.element.style.top = layout.y+'px'
    this.element.style.left = layout.x+'px'
    this.element.style.width = layout.width+'px'
    this.element.style.height = layout.height+'px'
    this.element.style.maxWidth = 'none'
    this.element.style.margin = 'auto'
    this.element.style.display = 'block'

    if (callback) callback()
  }

  _needUpdate(parent) {
    var size = parent.clientHeight + ' ' + parent.clientWidth;
    if (this._lastParentSize !== size) {
      this._lastParentSize = size;
      return true;
    }
    return false;
  }

  _innerFrameForSize(scale, align, source, dest){

    let scaleX, scaleY, result, scaleFactor

    result = { x: 0, y: 0, width: dest.width, height: dest.height }
    if (scale === CONSTANTS.FILL) return result

    scaleX = dest.width / source.width
    scaleY = dest.height / source.height

    switch (scale) {
      case CONSTANTS.BEST_FIT_DOWN_ONLY:
        if (this.options.logLevel > 1) {
          console.warn('imageScale - DEBUG WARNING: The scale '+scale+ 'was not understood.')
        }
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

    switch (align) {
      case this.ALIGN_LEFT:
        result.x = 0;
        result.y = (dest.height / 2) - (source.height / 2);
        break;
      case this.ALIGN_RIGHT:
        result.x =  - source.width;
        result.y = (dest.height / 2) - (source.height / 2);
        break;
      case this.ALIGN_TOP:
        result.x = (dest.width / 2) - (source.width / 2);
        result.y = 0;
        break;
      case this.ALIGN_BOTTOM:
        result.x = (dest.width / 2) - (source.width / 2);
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
      default: // this.ALIGN_CENTER
        if (align !== this.ALIGN_CENTER && this.options.logLevel > 1) {
          console.warn('imageScale - DEBUG WARNING: The align '+align+' was not understood.');
        }
        result.x = (dest.width / 2) - (source.width / 2);
        result.y = (dest.height / 2) - (source.height / 2);
    }

    return result

  }
}

module.exports = ImageScale