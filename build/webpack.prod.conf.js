var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
const TerserPlugin = require('terser-webpack-plugin')
var env = process.env.NODE_ENV === 'testing'
  ? require('../config/test.env')
  : config.build.env

var webpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true
    })
  },
  devtool: config.build.productionSourceMap ? '#source-map' : false,
  entry: '@/index.js',
  externals: {
    vue: 'vue'
  },
  output: {
    path: config.build.assetsRoot,
    filename: 'build.js',
    library: 'vuejs-uploader',
    libraryTarget: 'commonjs2'
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': env
    })
  ],
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({
      extractComments: 'all',
      terserOptions: {
        compress: {
          drop_console: true
        }
      }
    })]
  }
})

module.exports = webpackConfig
