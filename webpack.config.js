var path = require('path')

module.exports = {
  devServer: {
    contentBase: path.join(__dirname, 'sandbox'),
    compress: false,
    open: true,
    overlay: true,
    port: 9000
  },
  devtool: 'inline-source-map',
  entry: './sandbox/sandbox.ts',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        loader: 'ts-loader'
      }
    ]
  },
  resolve: {
    extensions: [ '.ts', '.js' ]
  }
}