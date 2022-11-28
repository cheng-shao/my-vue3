import type { App } from 'vue'
/** 常用flex组件 */
import { Flexbox, FlexboxItem } from '@/components/Flexbox'

import XrAvatar from '@/components/XrAvatar/index.vue'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'

export function setupGlobComponents(app: App) {
  app.component('flexbox', Flexbox)
  app.component('flexbox-item', FlexboxItem)

  app.component('xr-avatar', XrAvatar)

  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
}
