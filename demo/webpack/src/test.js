let Resizer = require('../../../src/ffcp.js')

let initResize = new Resizer()

let square = new Resizer({target: document.getElementById('square')})

let landscape = new Resizer({target: document.getElementById('landscape')})

let portrait = new Resizer({target: document.getElementById('portrait')})

function createHandler(resizer) {
  return function (e) {
    resizer.resizeAll({scale: e.srcElement.value})
  }
}
let squareButtons = document.querySelectorAll('input.sqr ')
Array.prototype.forEach.call(squareButtons, (button) => {
  button.onclick = createHandler(square)
})
let landscapeButtons = document.querySelectorAll('input.lndscp')
Array.prototype.forEach.call(landscapeButtons, (button) => {
  button.onclick = createHandler(landscape)
})
let portraitButtons = document.querySelectorAll('input.prtrt')
Array.prototype.forEach.call(portraitButtons, (button) => {
  button.onclick = createHandler(portrait)
})