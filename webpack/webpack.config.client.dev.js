var webpack = require('webpack');
var config = require('./webpack.config.client');
var _ = require('lodash');
var devProps = require('./devProps');

var config = module.exports = _.assign(_.clone(config), {
  entry: {
    client: [
      'webpack-dev-server/client?' + devProps.baseUrl,
      'webpack/hot/only-dev-server',
    ].concat(config.entry.client),
  },
  output: _.assign(_.clone(config.output), {
    publicPath: devProps.baseUrl + '/assets/',
    pathinfo: true,
    // crossOriginLoading is important since we are running
    // webpack-dev-server from a different port than Meteor
    crossOriginLoading: 'anonymous',
  }),
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel',
        exclude: /node_modules|lib/,
        query: {
          stage: 0,
          cacheDirectory: true,
          plugins: [
            'react-transform'
          ],
          extra: {
            'react-transform': {
              transforms: [{
                transform: 'react-transform-hmr',
                imports: ['react'],
                // this is important for Webpack HMR:
                locals: ['module']
              }]
            }
          },
        },
      },
      {
        test: /\.css$/,
        loader: 'style!css',
        exclude: /node_modules|lib/,
      },
    ],
  },
  plugins: (config.plugins || []).concat([
    new webpack.HotModuleReplacementPlugin(),
    // disable build of source maps for node_modules (vendor)
    new webpack.SourceMapDevToolPlugin({
      filename: '[file].map',
      exclude: ['vendor.bundle.js'],
      columns: false, // no columns in SourceMaps, faster
      module: true // use SourceMaps from loaders
    }),
  ]),
  devServer: {
    publicPath: devProps.baseUrl + '/assets/',
    host: devProps.host,
    hot: true,
    historyApiFallback: true,
    contentBase: devProps.baseUrl,
    port: devProps.webpackPort,
    proxy: {
      "*": devProps.contentBase,
    }
  }
});
