const path = require(`path`)

const cwd = process.cwd()
const { paths } = require(`${cwd}/package.json`)

module.exports = {
  entry: path.join(cwd, paths.sandboxFile),
  output: {
    filename: `bundle.js`,
    path: path.join(cwd, paths.sandboxDir)
  },
  resolve: {
    extensions: [`.js`]
  },
  resolveLoader: {
    modules: [
      `node_modules`
    ]
  },
  watchOptions: {
    ignored: /node_modules/
  }
}
