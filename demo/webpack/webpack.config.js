var path = require('path')

module.exports = {
  module: {
    loaders: [
      {test: /\.js$/, exclude: /(node_modules)/, loader: 'babel', query: {presets: ['es2015']}}
    ]
  },
  entry: ['./src/test'], // file extension after index is optional for .js files
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js'
  }
}