let ImageScale = require('../../../dist/ffcp.js')

let instance = new ImageScale()

  instance.resize(
    document.querySelector('.example-3'),
    document.querySelector('.example-3 .content')
  );

  console.log(instance.getSizes({
    content_width    : 200,
    content_height   : 300,
    container_width  : 600,
    container_height : 400
  }, 'cartesian'))


  console.log(instance.getSizes({
    content_width    : 200.4,
    content_height   : 300.5,
    container_width  : 600.6,
    container_height : 400.7,
    fit_type         : 'fit',
    alignment_x      : 'center',
    alignment_y      : 'center',
    rounding         : 'floor',
    coordinates      : 'cartesian'
  }))

