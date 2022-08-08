import type { RegisterClientOptions } from '@peertube/peertube-types/client'

function register (_options: RegisterClientOptions): void {
  console.log('Hello world')
}

export {
  register
}
