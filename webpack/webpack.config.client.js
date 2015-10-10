var path = require('path');
var webpack = require('webpack');
var SplitByPathPlugin = require('webpack-split-by-path');

module.exports = {
  context: __dirname,
  entry: {
    app: [
      './lib/core-js-no-number',
      'regenerator/runtime',
      '../app/main_client',
    ],
  },
  output: {
    path: path.join(__dirname, 'assets'),
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js',
    publicPath: '/assets/',
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    root: path.join(__dirname, '../app'),
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel',
        exclude: /node_modules|lib/,
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
    ],
  },
  plugins: [
    new webpack.PrefetchPlugin("react"),
    new webpack.PrefetchPlugin("react/lib/ReactComponentBrowserEnvironment"),
    // split node_modules into separate bundle (vendor)
    new SplitByPathPlugin([
      {
        name: 'vendor',
        path: path.join(__dirname, '../node_modules'),
      }
    ]),
  ]
};
