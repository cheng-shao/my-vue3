const cache = {
  /**
   * 载入全部登陆信息
   */
  loadingCache: function () {
    const appStore = useAppStore()
    if (get('Admin-Token') && !axios.defaults.headers['Admin-Token']) {
      /** 将用户信息放入缓存 */
      const userInfo = get('loginUserInfo')
      if (userInfo) {
        // store.commit('SET_USERINFO', userInfo)
        appStore.SET_USERINFO(userInfo)
      }
    }
    appStore.SET_APPNAME(get('systemName'))
    appStore.SET_APPLOGO(get('systemLogo'))
    // store.commit('SET_APPNAME', Lockr.get('systemName'))
    // store.commit('SET_APPLOGO', Lockr.get('systemLogo'))
  },
  /**
   * 请求和更新登录缓存
   */
  updateAxiosCache: function (token) {
    axios.defaults.headers['Admin-Token'] = token || get('Admin-Token')
    if (token) {
      set('Admin-Token', token)
    }
  },
  updateAxiosHeaders: function (token) {
    const newToken = token || get('Admin-Token')

    if (token) {
      set('Admin-Token', token)
    }

    if (newToken && axios.defaults.headers['Admin-Token'] !== newToken) {
      axios.defaults.headers['Admin-Token'] = newToken
      return true // token 变动
    }
  },
  /**
   * 移除登录信息
   * @param {*}
   */
  rmAxiosCache: function () {
    Cookies.remove('AdminToken', { domain: getCookiesDomain() })
    rm('Admin-Token')
  }
}

export default cache
