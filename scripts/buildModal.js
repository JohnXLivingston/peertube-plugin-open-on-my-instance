const path = require('path')
const esbuild = require('esbuild')

esbuild.build({
  entryPoints: [ path.resolve(__dirname, '..', 'modal', 'modal.ts') ],
  bundle: true,
  minify: true,
  sourcemap: true,
  format: 'iife',
  target: 'safari11',
  outfile: path.resolve(__dirname, '..', 'dist/modal', 'modal.js'),
}).catch(() => process.exit(1))
