module.exports = {
  // If this is missing, add it:
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: __dirname + '/dist',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',  // Injects CSS into the DOM
          'css-loader',    // Turns CSS into CommonJS
          'postcss-loader' // Processes CSS with PostCSS
        ]
      },
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
      }
    ]
  },
  devtool: 'source-map'
};
