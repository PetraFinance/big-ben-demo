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
  }
};

module.exports = config;
