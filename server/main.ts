import * as path from 'path'
import type { RegisterServerOptions } from '@peertube/peertube-types'

const got = require('got')

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

  router.get('/modal/instances', (req, res, next) => {
    const f = async (): Promise<void> => {
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      const start = (req.query.start ?? '0').toString()
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      const count = (req.query.count ?? '100').toString()
      peertubeHelpers.logger.debug('modal/instances: ' + start + '->' + start + '+' + count)
      const result = await getPeertubeInstances(options, start, count)
      res.type('json')
      res.send(JSON.stringify(result))
    }

    f().catch(err => next(err))
  })

  registerSettings(options)
}

function registerSettings (options: RegisterServerOptions): void {
  options.registerSetting({
    private: true,
    type: 'html',
    label: 'Documentation',
    // eslint-disable-next-line max-len
    descriptionHTML: 'You can find the documentation for this plugins <a target="_blank" href="https://github.com/JohnXLivingston/peertube-plugin-open-on-my-instance/blob/master/README.md">here</a>.'
  })

  options.registerSetting({
    private: false,
    type: 'input',
    name: 'iframe-url',
    label: 'Iframe URL',
    descriptionHTML: 'The iframe to display in the dialog. Please read the documentation.'
  })

  options.registerSetting({
    private: true,
    type: 'input',
    name: 'directory-url',
    label: 'Directory URL',
    descriptionHTML: 'The url to the Peertube instances directory to use.',
    default: 'https://instances.joinpeertube.org/api/v1/instances'
  })
}

async function unregister (): Promise<any> {
}

interface PeertubeInstances {
  total: number
  data: Array<{
    host: string
    name: string
  }>
}

async function getPeertubeInstances (
  options: RegisterServerOptions, start: string, count: string
): Promise<PeertubeInstances> {
  if (!/^\d+$/.test(start)) {
    throw new Error('Invalid start param')
  }
  if (!/^\d+$/.test(count)) {
    throw new Error('Invalid count param')
  }

  const directoryUrl = await options.settingsManager.getSetting('directory-url')
  if (!directoryUrl || typeof directoryUrl !== 'string') {
    throw new Error('The directory is not configured.')
  }

  const url = new URL('', directoryUrl)
  url.searchParams.set('start', start.toString())
  url.searchParams.set('count', count.toString())

  const result: PeertubeInstances = await got(directoryUrl, {
    json: true
  })

  return result
}

module.exports = {
  register,
  unregister
}
