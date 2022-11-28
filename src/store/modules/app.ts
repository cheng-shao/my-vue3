import logoImg from '@/assets/img/logo.png'

const DefaultSystemAlertProps = {
  title: '',
  type: 'warning',
  description: '',
  closable: true,
  center: false,
  closeText: '',
  showIcon: true,
  effect: 'light'
}

export const useAppStore = defineStore({
  id: 'app',
  state: () => ({
    logo: '',
    name: '',
    lang: localStorage.lang || 'cn',
    sidebar: {
      collapse: false
    },
    // CRM配置信息
    CRMConfig: {},
    // 图片缓存
    imageCache: {},
    // 活动咨询是否开启
    marketingEnable: false,
    // 导航栏系统提示
    systemAlertShow: false,
    systemAlertProps: {},
    // 模块权限
    moduleAuth: null,
    // 当前账套的月份
    nowMounth: '',
    cancelTokenArr: [], // 取消请求token数组

    moduleData: {} // 各模块状态 包含 时间 次数等信息
  }),
  getters: {
    // lang: (state) => state.lang,
    getApp: (state) => state,
    getLogo: (state) => {
      if (state.logo) {
        return state.logo
      }
      return logoImg
    },
    // name: (state) => {
    //   if (state.name) {
    //     return state.name
    //   }
    //   return window.WKConfig.companyName
    // },
    // nowMounth: (state) => state.nowMounth,
    // moduleData: (state) => state.moduleData,
    collapse: (state) => state.sidebar.collapse,
    // systemAlertShow: (state) => state.systemAlertShow,
    // systemAlertProps: (state) => state.systemAlertProps,
    // moduleAuth: (state) => state.moduleAuth,
    // // 配置信息
    // CRMConfig: (state) => state.CRMConfig,
    getImageCache: (state) => state.imageCache
  },
  actions: {
    // 原有的mutations
    SET_NOWMOUNTH(num) {
      this.nowMounth = num
    },
    SET_COLLAPSE(collapse) {
      this.sidebar.collapse = collapse
      set('sideBarCollapse', collapse)
    },
    SET_APPLOGO(logo) {
      this.logo = logo
    },
    SET_APPNAME(name) {
      this.name = name
    },
    SET_LANG(lang) {
      this.lang = lang
      window.app.$i18n.locale = lang
      localStorage.setItem('lang', lang)
      window.location.reload()
    },
    SET_CRMCONFIG(config) {
      this.CRMConfig = config
    },
    SET_IMAGECACHE(value) {
      this.imageCache = value
    },
    SET_MARKETINGENABLE(value) {
      this.marketingEnable = value
    },
    SET_SYSTEMALERTSHOW(value) {
      this.systemAlertShow = value
    },
    SET_SYSTEMALERTPROPS(value) {
      this.systemAlertProps = merge({ ...DefaultSystemAlertProps }, value || {})
    },
    SET_MODULEAUTH(value) {
      this.moduleAuth = value
    },
    SET_CANCELTOKENARR(payload) {
      this.cancelTokenArr.push(payload.cancelToken)
    },
    CLEAR_CANCELTOKENARR({ cancelTokenArr }) {
      cancelTokenArr.forEach((item) => {
        item('路由跳转取消请求')
      })
      cancelTokenArr = []
    },
    SET_MODULE_DATA(data) {
      this.moduleData = data
    },

    // 原有的actions
    // 登录
    SystemLogoAndName() {
      return new Promise((resolve, reject) => {
        adminSystemIndexAPI()
          .then((response) => {
            const resData = response.data || {}
            this.SET_APPNAME(resData.companyName)
            this.SET_APPLOGO(resData.companyLogo)
            set('systemLogo', resData.companyLogo)
            set('systemName', resData.companyName)

            if (resData.url) {
              getImageData(resData.url)
                .then((data) => {
                  const wkLogoCache = get('wkLogoCache')
                    ? JSON.parse(get('wkLogoCache'))
                    : {}
                  const userName = JSON.parse(
                    localStorage.getItem('loginUserInfo')
                  ).username
                  wkLogoCache[userName] = data.src
                  set('wkLogoCache', JSON.stringify(wkLogoCache))
                })
                .catch(() => {})
            }

            resolve(response)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    /**
     * 获取客户管理配置
     */
    CRMSettingConfig({ commit }) {
      return new Promise((resolve, reject) => {
        crmSettingConfigDataAPI()
          .then((response) => {
            commit('SET_CRMCONFIG', response.data)
            resolve(response)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    // // 查询活动配置
    // QueryMarketing({
    //   commit,
    //   state
    // }) {
    //   return new Promise((resolve, reject) => {
    //     configQueryMarketingAPI().then(res => {
    //       state.marketingEnable = res.data == 1
    //       resolve(res)
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 查询模块权限
    QueryModules() {
      return new Promise((resolve, reject) => {
        adminConfigsetIndexAPI()
          .then((res) => {
            const resData = res.data || []
            // status 状态 1:启用 0:停用 2:试用中 3:已过期,可用值:0,1,2,3
            const auth = {}
            resData.forEach((item) => {
              auth[item.module] = item.status === 1 || item.status === 2
            })
            // commit('SET_MODULEAUTH', auth)
            // commit('SET_MODULE_DATA', resData)

            this.SET_MODULEAUTH(auth)
            this.SET_MODULE_DATA(resData)
            resolve(res)
          })
          .catch((error) => {
            reject(error)
          })
      })
    }
  }
})
