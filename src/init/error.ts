import type { App } from 'vue'

function vueErrorHandler(err: Error, vm: any, info: string) {
  console.log(err, vm, info, 'vue--')
  return {}
}

export function scriptErrorHandler(
  event: Event | string,
  source?: string,
  lineno?: number,
  colno?: number,
  error?: Error
) {
  console.log('info', source)
}

export function handleError(app: App) {
  app.config.errorHandler = vueErrorHandler

  window.onerror = scriptErrorHandler
}
