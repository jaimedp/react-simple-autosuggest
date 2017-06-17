var webpack = require('webpack');
var pkg = require('./package.json');
var path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, "lib"),
    filename: 'index.js',
    library: pkg.name,
    libraryTarget: "umd",
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      { test: /\.jsx?$/, exclude: /node_modules/, loader: ['babel-loader'] }
    ]
  },
  externals: ['react', 'prop-types'],
  plugins: [
    new webpack.optimize.UglifyJsPlugin(),
  ],
  devtool: 'source-map'
};
