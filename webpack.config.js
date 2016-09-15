var extend = require("extend");
var path = require("path");
var webpack = require("webpack");
var fs = require("fs");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var CopyWebpackPlugin = require("copy-webpack-plugin");
var sass = require("node-sass");

var DEBUG = !process.argv.includes('--release');

var srcPath = path.join(__dirname, "./src");
var destPath = path.join(__dirname, "./build");
var nodeModulesPath = path.join(__dirname, "./node_modules");

module.exports =  {
  name: 'browser',
  entry: {
      'header.css': srcPath + '/frontend/main.scss',
      'header.js':  srcPath + '/frontend/main.js',
      'presenter.js':  srcPath + '/presenter.js',
  },
  output: {
    filename: '[name]',
    path: destPath
  },
  module: {
    loaders: [
        // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
        {
          test: /\.jsx?$/,
          loader: "babel-loader",
          exclude: /node_modules/,
          query: {
            presets: ['es2015']
          }
        },
        {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract("style-loader", "css-loader")
        },
        // All files with a '.scss' extension will be handled by 'sass-loader'.
        {
          test: /\.scss$/i,
          loader: ExtractTextPlugin.extract("style-loader", "css-loader!sass-loader")
        },
    ],
  },

  // Use the plugin to specify the resulting filename (and add needed behavior to the compiler)
  plugins: [
      new ExtractTextPlugin("[name]"),
      new CopyWebpackPlugin([
        { flatten: true, from: './src/frontend/images/*', to: destPath},
        { from: './modules/*/frontend/images/*', to: destPath},
      ])
      // new webpack.optimize.UglifyJsPlugin( {
      //   compress: {
      //     warnings: false
      //   },
      //   mangle: {
      //     except: ['$', 'exports', 'require']
      //   }
      // })
  ],

  resolve: {
      extensions: ["", ".webpack.js", ".web.js", ".js", "css", "scss"]
  },
  // devtool: 'source-map',
  externals: {
    "jquery": "$",
  }
};
