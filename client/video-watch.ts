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
  console.log('[open-on-my-instance] addButton')
  if (video.isLocal) {
    return
  }
  // The video is remote, we must add the button.
  setTimeout(() => {
    console.log('[open-on-my-instance] The current video is remote, adding the button...')
    // FIXME: use a Peertube placeholder
    const openButton = document.createElement('a')
    openButton.textContent = 'Open'
    openButton.classList.add('action-button')
    openButton.onclick = () => openModal(options, video)

    const placeholder = document.getElementsByTagName('my-video-rate')[0]
    placeholder?.before(openButton)

    console.log('[open-on-my-instance] The button was added.')
  }, 100)
}

function cleanDom (): void {
  console.log('[open-on-my-instance] Cleaning the DOM')
  // TODO: remove buttons?
}

function openModal ({ peertubeHelpers }: RegisterClientOptions, _video: Video): void {
  peertubeHelpers.showModal({
    title: 'Open on my instance',
    content: '<p>Here we go!</p>',
    close: true
  })
}

export {
  register
}
