const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const devMode = process.env.NODE_ENV !== 'production';

module.exports = {
  mode: devMode ? 'development' : 'production',
  entry: path.resolve(__dirname, 'src/demo/src/demo.js'),
  watch: devMode,
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000
  },
  output: {
    path: path.resolve(__dirname, 'src/demo/dist'),
    filename: 'demo.min.js'
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "demo.min.css"
    })
  ],
  module: {
    rules: [{
      test: /\.less$/,
      use: [{
          loader: MiniCssExtractPlugin.loader,
        }, {
          loader: 'css-loader', // translates CSS into CommonJS
          options: {
            minimize: true
          }
        }, {
          loader: 'less-loader' // compiles Less to CSS
      }]
    }, {
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['env', 'react']
        }
      }
    }]
  }
};
