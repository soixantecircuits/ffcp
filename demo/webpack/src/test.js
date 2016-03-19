let Resizer = require('../../../src/ffcp.js')

let resizer = new Resizer()

let container = document.querySelector('#demo-container')
  , image = document.querySelector('#demo-content')

let currentConfig = {
  alignX: 'center',
  alignY: 'center',
  scale: 'best-fill'
}

window.resizeImage = function (options) {
  Object.assign(currentConfig, options)
  console.log(currentConfig)
  resizer.resize(container, image, currentConfig)
}

window.landscape = function () {
  image.src = 'test3.png'
}

window.portrait = function () {
  image.src = 'test2.jpg'
}

window.square = function () {
  image.src = 'test1.jpg'
}