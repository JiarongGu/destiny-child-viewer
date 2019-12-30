const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

const baseConfig = require('./webpack.base.config');

const appPublic = path.resolve(__dirname, './public');
const appSrc = path.resolve(__dirname, './src');
const appResources = path.resolve(__dirname, './resources');
const appOutput = path.resolve(__dirname, './dist');

// get alias from tsconfig
const tspaths = require('./tspaths.json');
const tsAliasPaths = tspaths.compilerOptions.paths;
const aliasKeys = Object
  .keys(tsAliasPaths)
  .filter(key => key.indexOf('*') < 0);
const alias = aliasKeys.reduce((aliasValue, key) => {
  aliasValue[key] = path.join(appSrc, tsAliasPaths[key][0]);
  return aliasValue;
}, {});

const sassRegex = /\.s[ac]ss$/i;

module.exports = merge.smart(baseConfig, {
  target: 'electron-renderer',
  context: `${appSrc}/renderer`,
  entry: {
    app: ['@babel/polyfill', './index.tsx']
  },
  resolve: { alias },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: ['babel-loader', 'ts-loader'],
        exclude: /node_modules/
      },
      {
        test: sassRegex,
        loaders: [
          'css-hot-loader',
          'style-loader',
          'css-type-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]__[local]__[hash:base64:5]'
              },
              localsConvention: 'camelCase',
              sourceMap: true,
              importLoaders: 1
            }
          },
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass'),
              sassOptions: {
                includePaths: ['./src/styles'],
              },
            }
          }
        ]
      },
      {
        test: /\.css$/,
        loaders: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          'css-loader'
        ]
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/,
        use: [
          'file-loader',
          {
            loader: 'image-webpack-loader',
            options: {
              disable: true
            }
          }
        ]
      },
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader'
      }
    ]
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // all options are optional
      filename: '[name].css',
      chunkFilename: '[id].css',
      ignoreOrder: false // Enable to remove warnings about conflicting order
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(appPublic, 'index.html'),
      minify: false
    }),
    new CopyWebpackPlugin([{ from: appPublic, to: appOutput }], { ignore: ['index.html'] }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.APP_RESOURCES': JSON.stringify(appResources)
    })
  ]
});
