import type { App } from 'vue'
import type { Router } from 'vue-router'
import { createPermissionGuard } from '@/router/guard/permission'

export function setupRouterGuard(app: App, router: Router) {
  return new Promise((resolve, reject) => {
    createPermissionGuard(app, router)
  })
}
