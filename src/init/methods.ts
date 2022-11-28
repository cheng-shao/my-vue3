import type { App } from 'vue'

import config from '@/config'
import { getPermissionByKey } from '@/utils'

export function setupGlobMethods(app: App) {
  const globProp = app.config.globalProperties

  // 配置信息
  window.WKConfig = config
  globProp['WKConfig'] = config

  globProp['$auth'] = getPermissionByKey
}
