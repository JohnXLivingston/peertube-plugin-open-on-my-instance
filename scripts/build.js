const path = require('path')
const esbuild = require('esbuild')

const clientFiles = [
  'video-watch.js'
]

const configs = clientFiles.map(f => ({
  entryPoints: [ path.resolve(__dirname, '..', 'build/client', f) ],
  bundle: true,
  minify: true,
  format: 'esm',
  target: 'safari11',
  outfile: path.resolve(__dirname, '..', 'dist/client', f),
}))

const promises = configs.map(c => esbuild.build(c))

Promise.all(promises)
  .catch(() => process.exit(1))