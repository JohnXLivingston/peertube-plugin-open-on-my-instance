import { init } from 'open-on-my-instance'

const container: HTMLDivElement = document.querySelector('div[container]') as HTMLDivElement
if (container) {
  init(container).then(() => {}, () => {})
}
