import type { Video } from '@peertube/peertube-types'
import type { RegisterClientOptions } from '@peertube/peertube-types/client'

interface VideoWatchLoadedHookOptions {
  videojs: any
  video: Video
  playlist?: any
}

async function addButton ({ video }: VideoWatchLoadedHookOptions): Promise<void> {
  console.log('[open-on-my-instance] addButton')
  if (video.isLocal) {
    return
  }
  // The video is remote, we must add the button.
  console.log('[open-on-my-instance] The current video is remote, adding the button...')
  // FIXME: use a Peertube placeholder
  const openButton = document.createElement('a')
  openButton.textContent = 'Open'
  openButton.classList.add('icon-text')

  const placeholder = document.getElementById('plugin-placeholder-player-next')
  placeholder?.append(openButton)

  console.log('[open-on-my-instance] The button was added.')
}

function cleanDom (): void {
  console.log('[open-on-my-instance] Cleaning the DOM')
  // TODO: remove buttons?
}

function register ({
  registerHook
}: RegisterClientOptions): void {
  registerHook({
    target: 'action:video-watch.video.loaded',
    handler: addButton
  })

  registerHook({
    target: 'action:router.navigation-end',
    handler: cleanDom
  })
}

export {
  register
}
