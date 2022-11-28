import type { App } from 'vue'
import { setupGlobPlugins } from './plugins'
import { setupGlobMethods } from './methods'
import { setupGlobComponents } from './components'

export function installPluginsMethodsComponents(app: App) {
  setupGlobPlugins(app)
  setupGlobMethods(app)
  setupGlobComponents(app)
}
