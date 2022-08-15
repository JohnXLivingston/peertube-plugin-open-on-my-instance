import type { Video } from '@peertube/peertube-types'
import type { RegisterClientOptions } from '@peertube/peertube-types/client'

interface VideoWatchLoadedHookOptions {
  videojs: any
  video: Video
  playlist?: any
}

function register (clientOptions: RegisterClientOptions): void {
  const registerHook = clientOptions.registerHook

  registerHook({
    target: 'action:video-watch.video.loaded',
    handler: async (videoWatchHookOptions: VideoWatchLoadedHookOptions) => {
      await addButton(clientOptions, videoWatchHookOptions)
    }
  })

  registerHook({
    target: 'action:router.navigation-end',
    handler: cleanDom
  })
}

async function addButton (options: RegisterClientOptions, { video }: VideoWatchLoadedHookOptions): Promise<void> {
  const peertubeHelpers = options.peertubeHelpers

  console.log('[open-on-my-instance] addButton')
  if (video.isLocal) {
    return
  }

  const openLabel = await peertubeHelpers.translate('Open')
  const openTitle = await peertubeHelpers.translate('Open on my instance')

  // The video is remote, we must add the button.
  const p: Promise<void> = new Promise((resolve, _reject) => {
    setTimeout(() => {
      console.log('[open-on-my-instance] The current video is remote, adding the button...')
      // FIXME: use a Peertube placeholder
      const openButton = document.createElement('a')
      openButton.textContent = openLabel
      openButton.title = openTitle
      openButton.classList.add('action-button')
      openButton.onclick = async () => openModal(options, video)

      const placeholder = document.getElementsByTagName('my-video-rate')[0]
      placeholder?.before(openButton)

      console.log('[open-on-my-instance] The button was added.')
      resolve()
    }, 100)
  })

  return p
}

function cleanDom (): void {
  console.log('[open-on-my-instance] Cleaning the DOM')
  // TODO: remove buttons?
}

async function openModal ({ peertubeHelpers }: RegisterClientOptions, _video: Video): Promise<void> {
  const title = await peertubeHelpers.translate('Open on my instance')

  const path = peertubeHelpers.getBaseRouterRoute()
  console.log('The path is: ' + path)

  peertubeHelpers.showModal({
    title,
    content: '<p>Here we go!</p>',
    close: true
  })
}

export {
  register
}
