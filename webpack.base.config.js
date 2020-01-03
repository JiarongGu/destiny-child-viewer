'use strict';

const webpack = require('webpack');
const path = require('path');
const appSrc = path.resolve(__dirname, './src');
const appResources = path.resolve(__dirname, './resources');

// get alias from tsconfig
const tspaths = require('./tspaths.json').compilerOptions.paths;
const alias = Object.keys(tspaths)
  .filter(key => key.indexOf('*') < 0)
  .reduce((aliasValue, key) => {
    aliasValue[key] = path.join(appSrc, tspaths[key][0]);
    return aliasValue;
  }, {});

module.exports = {
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  node: {
    __dirname: false,
    __filename: false
  },
  resolve: {
    alias,
    extensions: ['.tsx', '.ts', '.js', '.json']
  },
  devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.APP_RESOURCES': JSON.stringify(appResources)
    })
  ]
};
