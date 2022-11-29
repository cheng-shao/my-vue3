import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import 'virtual:windi.css'
// import 'element-plus/dist/index.css'
// iconfont图标库
import './assets/iconfont/iconfont.css'
import '@/styles/index.scss' // global css

import App from './App.vue'

import { installPluginsMethodsComponents } from './init'
import { setupGlobDirectives } from '@/directives'

import { setupStore } from './store'
import { setupRouter, router } from './router'
import { setupRouterGuard } from '@/router/guard'

function initApp() {
  const app = createApp(App)

  // 状态管理
  setupStore(app)

  // 注册全局插件、方法、组件
  installPluginsMethodsComponents(app)

  // 路由守卫
  setupRouterGuard(app, router)

  // 配置路由
  setupRouter(app)

  // 注册全局指令 app
  setupGlobDirectives()

  app.mount('#app')
}

initApp()
