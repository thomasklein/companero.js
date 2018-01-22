const path = require(`path`)

const cwd = process.cwd()
const { paths } = require(`${cwd}/package.json`)
const sandboxDirPath = path.join(cwd, paths.sandboxDir)

module.exports = {
  files: [sandboxDirPath],
  ghostMode: {
    clicks: true,
    forms: true,
    scroll: true
  },
  notify: false,
  online: true,
  server: {
    baseDir: sandboxDirPath
  },
  ui: {
    port: 8080,
    weinre: {
      port: 9090
    }
  }
}
