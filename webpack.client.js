const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const devMode = process.env.NODE_ENV !== "production";

module.exports = {
  mode: process.env.NODE_ENV,
  entry: './client/index.tsx',  // 入口文件路径
  output: {
    path: path.resolve(__dirname, 'dist'),  // 出口文件
    filename: 'client.js'    // 出口文件名称
  },
  devServer: {
    port: 2024,
    open: true,
    hot: true,
    host: 'localhost',
  },
  module: {
    rules: [
      {
        test: /\.(tsx?|jsx?)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        },
      },
      {
        test: /\.(less|scss|css)$/,
        exclude: /node_modules/,
        use: [
          devMode ? "style-loader" : MiniCssExtractPlugin.loader,
          'css-loader',
          'less-loader',
        ],
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: 'ts-loader'
      },
    ],
  },
  plugins: [].concat(devMode ? [] : [new MiniCssExtractPlugin()]),
}