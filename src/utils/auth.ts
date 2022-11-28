/** 移除授权信息 */
export function removeAuth(props = { clearCookies: false }) {
  const userStore = useUserStore()
  return new Promise((resolve, reject) => {
    // if (props.clearCookies) {
    //   Cookies.remove('User', { path: '/', domain: '.72crm.com' })
    // }
    cache.rmAxiosCache()
    // store.commit('SET_ALLAUTH', null)
    userStore.SET_ALLAUTH(null)
    delete axios.defaults.headers['Admin-Token']
    resolve(true)
  })
}

/** 注入授权信息 */
export function addAuth(adminToken) {
  return new Promise((resolve, reject) => {
    axios.defaults.headers['Admin-Token'] = adminToken

    // store.dispatch('SystemLogoAndName')
    resolve(true)
  })
}

/** 获取授权信息 */
export function getAuth() {
  const userStore = useUserStore()
  return new Promise((resolve, reject) => {
    // cookie 的优先级最高，与它不同的会被覆盖掉
    const cookieAdminToken = Cookies.get('AdminToken')
    const axiosAdminToken = axios.defaults.headers['Admin-Token']
    if (axiosAdminToken) {
      // 本地cookie 存在，但与当前axios不一样，用cookie覆盖所有
      if (!!cookieAdminToken && axiosAdminToken !== cookieAdminToken) {
        cache.updateAxiosCache(cookieAdminToken)
      }
      resolve()
    } else {
      // if (Lockr.get('Admin-Token') || Cookies.get('User')) {
      let lockAdminToken = get('Admin-Token')
      // 状态码 1007 下 会忽略下一次的cookies信息读取
      // 重点 数据以cookie为准，只要cookie有值，或者与localstorage不同，覆盖localstorage
      if (
        window.sessionStorage.wkIgnoreCookies !== true &&
        !!cookieAdminToken &&
        lockAdminToken !== cookieAdminToken
      ) {
        set('Admin-Token', cookieAdminToken)
        lockAdminToken = cookieAdminToken
      }

      // 本地有lock
      if (!!lockAdminToken && !cookieAdminToken) {
        const domain = getCookiesDomain()
        Cookies.set('AdminToken', lockAdminToken, {
          domain: domain,
          expires: 365
        })
      }

      if (lockAdminToken) {
        cache.updateAxiosCache()
        userStore
          .GetUserInfo()
          .then(() => {
            // 不忽略Cookies
            window.sessionStorage.wkIgnoreCookies = false
            resolve()
          })
          .catch(() => {
            reject()
          })
      } else {
        resolve({ notoken: true })
      }
    }
  })
}
