import type { App } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHashHistory } from 'vue-router'

import path from 'path-browserify'

const dynamicRouter = [] as any
const modules = import.meta.glob('./modules/*.ts')
for (const key in modules) {
  modules[key]().then((res) => {
    const [name] = path.basename(key).split('.')
    dynamicRouter.push({
      type: name,
      router: res[`${name}Router`]
    })
  })
}

export { dynamicRouter }

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/index.vue'),
      hidden: true
    },
    {
      path: '/404',
      component: () => import('@/views/404.vue'),
      hidden: true
    },
    {
      path: '/noAuth',
      name: 'noAuth',
      component: () => import('@/views/NoAuth.vue'),
      hidden: true
    },
    {
      path: '/:pathMatch(.*)',
      redirect: '/404',
      hidden: true
    }
  ] as unknown as RouteRecordRaw[],
  scrollBehavior: () => ({ left: 0, top: 0 })
})

export function setupRouter(app: App<Element>) {
  app.use(router)
}
