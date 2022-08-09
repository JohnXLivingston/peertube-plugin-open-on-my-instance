const path = require('path')
const esbuild = require('esbuild')

const clientFiles = [
  'video-watch'
]

const configs = clientFiles.map(f => ({
  entryPoints: [ path.resolve(__dirname, '..', 'client', f+'.ts') ],
  bundle: true,
  minify: true,
  sourcemap: false, // FIXME: `true` does not work for now, because peertube does not serve static files.
  format: 'esm',
  target: 'safari11',
  outfile: path.resolve(__dirname, '..', 'dist/client', f+'.js'),
}))

const promises = configs.map(c => esbuild.build(c))

Promise.all(promises)
  .catch(() => process.exit(1))
