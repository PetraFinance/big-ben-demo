const WriteFilePlugin = require('write-file-webpack-plugin');

const config = {
	entry: './client.js',
  output: {
    filename: 'bundle.js',
    path: __dirname + '/docs'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      }
    ]
  },
  plugins: [
    new WriteFilePlugin(),
  ],
  devtool: 'source-map',
};

module.exports = config;
