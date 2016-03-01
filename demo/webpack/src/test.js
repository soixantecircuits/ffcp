let resizer = require('../../../src/ffcp.js')

let instance = new resizer()

var buttons = document.getElementsByTagName('input')
function handleClick(e) {
  let options = {
    scale: e.srcElement.value
  }
  instance.resizeAll(options)
}
Array.prototype.forEach.call(buttons, (button) => {
  button.onclick = handleClick
})