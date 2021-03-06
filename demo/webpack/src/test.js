let Resizer = require('../../../src/ffcp.js')

let container = document.querySelector('#demo-container')
  , image = document.querySelector('#demo-content')

let currentConfig = {
  alignX: 'center',
  alignY: 'center',
  scale: 'best-fill',
  forceStyle: true
}

Resizer.resizeAll(document.body)

window.resizeImage = function (options) {
  Object.assign(currentConfig, options)
  Resizer.resize(container, image, currentConfig)
}

window.landscape = function () {
  image.src = 'test3.png'
  resizeImage(currentConfig)
}

window.portrait = function () {
  image.src = 'test2.jpg'
  resizeImage(currentConfig)
}

window.square = function () {
  image.src = 'test1.jpg'
  resizeImage(currentConfig)
}