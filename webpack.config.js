var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: './src/js/index.js',
  output: {
    filename: 'src/app.js'       
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel!exports' }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.json']
  }
};
