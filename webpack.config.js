const path = require('path');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: './src/index.js',
  optimization: {
    minimize: true
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './dist'),
    clean: true
  },
  mode: 'production',
  optimization: {
    usedExports: true
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  plugins: [
    new webpack.IgnorePlugin({
      resourceRegExp: /\.env$/,
    }),
    new Dotenv({
      path: './.env', // Path to your .env file
      safe: false,     // Optional: Validate against .env.example
    })
  ],
  target: 'node'
};