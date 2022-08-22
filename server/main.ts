import * as path from 'path'
import type { RegisterServerOptions } from '@peertube/peertube-types'

async function register (options: RegisterServerOptions): Promise<any> {
  const peertubeHelpers = options.peertubeHelpers
  peertubeHelpers.logger.info('Registering the plugin...')

  const router = options.getRouter()
  router.get('/modal/content', (_req, res) => {
    res.status(200)
    res.type('html')
    res.removeHeader('X-Frame-Options')
    res.sendFile(path.resolve(__dirname, '..', '..', 'assets', 'modal.html'))
  })

  router.get('/modal/modal.js', (_req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'modal', 'modal.js'))
  })
  router.get('/modal/modal.js.map', (_req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'modal', 'modal.js.map'))
  })
}

async function unregister (): Promise<any> {
}

module.exports = {
  register,
  unregister
}
