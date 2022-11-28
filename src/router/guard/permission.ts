import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css' // Progress 进度条样式

import type { App } from 'vue'
import type { Router } from 'vue-router'

const whiteList = ['login', 'register', 'link'] // 不重定向白名单
const pathWhiteList = ['/404', '/noAuth'] // 不重定向白名单
let tryCount = 3 // 如果0 清空授权
// 是否能继续出错
function canTryFun() {
  return tryCount > 0
}

// 出错
function executeTryFun() {
  return tryCount--
}

// 重置
function resetTryFun() {
  tryCount = 3
}

// next 到登录
function nextLogin(to, from, next) {
  // 没权限
  if (whiteList.indexOf(to.name) !== -1) {
    next()
  } else {
    next(
      `/login?redirect=${
        pathWhiteList.includes(to.path)
          ? to.redirectedFrom?.fullPath || '/'
          : to.path
      }`
    ) // 否则全部重定向到登录页
  }
}

export function createPermissionGuard(app: App, router: Router) {
  const userStore = useUserStore()
  const appStore = useAppStore()
  const permissionStore = usePermissionStore()

  router.beforeEach(async (to, from, next) => {
    // store.commit('CLEAR_CANCELTOKENARR') // 取消请求

    let redirectedFrom = to.redirectedFrom?.fullPath
    if (from.name === 'login' && to.path === '/404') {
      redirectedFrom = '/' // 可能因重定向导致404 校准一次
    }

    if (to.meta.disabled) {
      next(false)
      return
    }
    NProgress.start()
    // 允许进入登录页面  1005 需要完善信息 不能清除登录信息
    if (window.accessLogin) {
      next()
      NProgress.done()
      return
    }

    // 请求头包含授权信息 并且 页面必须授权 直接进入
    try {
      const authData = await getAuth()
      if (authData?.notoken) {
        nextLogin(to, from, next)
        return
      }

      if (to.name === 'login') {
        next({
          path: '/'
        })
      } else {
        if (permissionStore.addRouters.length === 0) {
          // 判断当前用户是否获取权限
          await appStore.QueryModules()
          const auths = await userStore.getAuth()
          await permissionStore.GenerateRoutes(auths)
          permissionStore.addRouters.forEach((route) => {
            router.addRoute(route)
          })

          resetTryFun()
          if (pathWhiteList.includes(to.path)) {
            if (
              isArray(permissionStore.addRouters) &&
              permissionStore.addRouters.length === 0
            ) {
              throw new Error('routeError')
            } else {
              next({
                path: redirectedFrom || '/',
                replace: true
              })
            }
          } else {
            next({
              ...to,
              replace: true
            })
          }
        } else {
          resetTryFun()
          next()
        }
        NProgress.done()
      }
    } catch (error) {
      executeTryFun()

      // 302 登录信息失效 1007 企业用户不存在
      if (
        (error && (error.code === 302 || error.code === 1007)) ||
        !canTryFun()
      ) {
        resetTryFun()
        await removeAuth()
        // 没权限
        nextLogin(to, from, next)
        NProgress.done()
      } else {
        // 因为网络原因，但已登录，转404页面。 如果没有，跳转登录
        getAuth()
          .then(() => {
            if (error) {
              to.name === 'noAuth' ? next() : next('/noAuth')
            } else {
              if (pathWhiteList.includes(to.path)) {
                next(redirectedFrom || '/')
              } else {
                next()
              }
            }
            NProgress.done()
          })
          .catch(() => {
            // 没权限
            nextLogin(to, from, next)
            NProgress.done()
          })
      }
    }
  })

  router.afterEach(() => {
    NProgress.done() // 结束Progress
  })

  router.onError((error) => {
    const pattern = /Loading chunk (\d)+ failed/g
    const isChunkLoadFailed = error.message.match(pattern)
    // const targetPath = router.history.pending.fullPath
    const targetPath = router.options.history.state.current as string
    if (isChunkLoadFailed) {
      router.replace(targetPath)
    }
  })
}
