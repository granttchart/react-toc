const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const devMode = process.env.NODE_ENV !== 'production';

module.exports = {
  mode: devMode ? 'development' : 'production',
  entry: './src/react-toc.js',
  watch: devMode,
  devServer: devMode ? {
      contentBase: path.resolve(__dirname, 'dist'),
      compress: true,
      open: true
    } : {},
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'react-toc.min.js'
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "react-toc.min.css"
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
        loader: "babel-loader"
      }
    }]
  }
};
