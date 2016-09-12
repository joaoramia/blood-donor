var webpack = require('webpack');

module.exports = {
  entry: [
    './browser/js/index.jsx'
  ],
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query:
      {
        plugins: ['transform-runtime'],
        presets:['react', 'es2015', 'stage-0']
      }
    }]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  output: {
    path: __dirname + '/browser/js',
    publicPath: '/',
    filename: 'bundle.js'
  }
};