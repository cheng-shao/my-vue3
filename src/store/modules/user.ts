// 校准域名头部
const correctDomain = function () {
  return new Promise((resolve, reject) => {
    adminSystemConfigIndexAPI()
      .then((res) => {
        resolve('')
        const resData = res.data || {}
        const companyDomainAll = resData.companyDomain
        const hostname = window.location.hostname

        if (companyDomainAll) {
          const companyDomain = companyDomainAll.split('.')[0]
          const currentDomain = window.location.hostname.split('.')[0]

          const hash = window.location.hash
          if (currentDomain && companyDomain) {
            if (companyDomain.toLowerCase() !== currentDomain.toLowerCase()) {
              if (hash.includes('register/index')) {
                window.location.href = 'http://' + companyDomainAll
              } else {
                window.location.href = 'http://' + companyDomainAll + '/' + hash
              }
            } else {
              // 如果hash 是注册页面。但host name 不是www 跳首页
              if (
                hash.includes('register/index') &&
                !hostname.startsWith('www')
              ) {
                window.location.href = 'http://' + companyDomainAll
              }
            }
          }
        } else if (!companyDomainAll && !hostname.startsWith('www')) {
          // 如果没有配置二级域名，并且当前域名不是www 开始的 跳转www
          window.location.href = WKConfig.homeUrl
        }
      })
      .catch(() => {
        reject()
      })
  })
}

function loopUserDeptMap(list, map, userList, deptList) {
  list.forEach((item) => {
    map[`dept-${item.deptId}`] = item
    deptList.push(item) // 添加部门搜索数据源

    if (item.userList) {
      item.userList.forEach((user) => {
        map[`user-${user.userId}`] = user
        userList.push(user) // 添加员工搜索数据源
      })
    }
    if (item.children) {
      loopUserDeptMap(item.children, map, userList, deptList)
    }
  })
}

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    userInfo: null, // 用户信息
    // 权限信息
    allAuth: null, // 总权限信息 默认空 调整动态路由
    userDeptObj: {
      disableUserList: [],
      userMap: {},
      deptList: []
    }, // 查询完整组织架构信息
    userDeptMap: {}, // 根据user + id 和 dept + id 形成的对象
    searchUserDept: {
      userList: [],
      deptList: [],
      disableUserList: []
    }, // 用于搜索  一维数组
    userList: [], // 管理后台员工和部门
    deptList: [],
    crm: {}, // 客户管理
    bi: {}, // 商业智能
    manage: {}, // 管理后台
    oa: {}, // 办公
    emailMsg: {},
    emailNum: {},
    project: {}, // 项目管理
    email: {}, // 邮箱
    knowledge: {}, // 知识库
    call: false, // 呼叫中心是否开启
    hrm: {}, // 人力资源
    jxc: {}, // 进销存
    finance: {} // 财务管理
  }),
  getters: {
    // userInfo: (state) => state.userInfo,
    // userList: (state) => state.userList,
    // userDeptObj: (state) => state.userDeptObj,
    // userDeptMap: (state) => state.userDeptMap,
    // searchUserDept: (state) => state.searchUserDept,
    // deptList: (state) => state.deptList,
    // // 权限
    // allAuth: (state) => state.allAuth,
    // crm: (state) => state.crm,
    // bi: (state) => state.bi,
    // manage: (state) => state.manage,
    // oa: (state) => state.oa,
    // project: (state) => state.project,
    // email: (state) => state.email,
    // knowledge: (state) => state.knowledge,
    // hrm: (state) => state.hrm,
    // call: (state) => state.call, // 模块权限
    // jxc: (state) => state.jxc,
    // finance: (state) => state.finance,
    // // 邮箱信息
    // emailNum: (state) => state.emailNum,
    // emailMsg: (state) => state.emailMsg
  },
  actions: {
    // 原有的mutions
    SET_EMAIL_MSG(emailMsg) {
      this.emailMsg = emailMsg
    },

    SET_EMAIL_NUMBER(emailNum) {
      this.emailNum = emailNum
    },
    SET_USERINFO(userInfo) {
      this.userInfo = userInfo
      localStorage.setItem('loginUserInfo', JSON.stringify(userInfo))
    },
    SET_ALLAUTH(allAuth) {
      this.allAuth = allAuth
    },
    SET_CRM(crm) {
      this.crm = crm
    },
    SET_BI(bi) {
      this.bi = bi
    },
    SET_MANAGE(manage) {
      this.manage = manage
    },
    SET_OA(oa) {
      this.oa = oa
    },
    SET_PROJECT(project) {
      this.project = project
    },
    SET_EMAIL(email) {
      this.email = email
    },
    SET_KNOWLEDGE(knowledge) {
      this.knowledge = knowledge
    },
    SET_HRM(hrm) {
      this.hrm = hrm
    },
    SET_CALL(call) {
      this.call = call
    },
    SET_JXC(jxc) {
      this.jxc = jxc
    },
    SET_FINANCE(data) {
      this.finance = data
    },
    SET_AUTH(data) {
      const token = data.adminToken
      set('Admin-Token', token)
      const domain = getCookiesDomain()
      Cookies.set('AdminToken', token, { domain: domain, expires: 365 })
      addAuth(token)
    },
    SET_USERLIST(data) {
      this.userList = data
    },
    SET_DEPTLIST(data) {
      this.deptList = data
    },
    SET_USERDEPTOBJ(data) {
      this.userDeptObj = data
    },
    SET_USERDEPTMAP(data) {
      const tempMap = {
        // 'dept-0': {
        //   deptId: 0,
        //   name: '全公司'
        // }
      }
      const userList = []
      const deptList = []
      loopUserDeptMap(data.deptList, tempMap, userList, deptList)

      const disableUserList = []
      data.disableUserList.forEach((user) => {
        tempMap[`user-${user.userId}`] = user
        disableUserList.push(user)
      })

      // 同时更新 搜索 和 map
      this.searchUserDept = {
        userList,
        deptList,
        disableUserList
      }
      this.userDeptMap = tempMap
    },

    // 原有的actions
    // 登录
    async Login(userInfo) {
      const password = userInfo.password
        ? RSAencrypt(userInfo.password + Date.now().toString())
        : ''
      const params = objDeepCopy(userInfo)
      if (password) {
        params.password = password
      }
      return new Promise((resolve, reject) => {
        loginAPI(params)
          .then((res) => {
            const data = res.data || {}
            if (!data.hasOwnProperty('companyList')) {
              // commit('SET_AUTH', data)
              this.SET_AUTH(data)
              this.GetUserInfo()
              // dispatch('GetUserInfo')
            }
            resolve(res)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    // 获取权限
    async getAuth() {
      let data = {}
      try {
        const authData = await adminIndexAuthListAPI()
        data = authData.data
      } catch (error) {
        return Promise.reject(error)
      }

      // 财务模块开启的话发送
      const appStore = useAppStore()
      const moduleAuth = appStore.moduleAuth
      const financeAuth = moduleAuth && moduleAuth.finance
      if (financeAuth) {
        try {
          const financeData = await adminFinanceAuthListAPI()
          if (financeData && financeData.data && financeData.data.finance) {
            data.finance = financeData.data.finance
          }
        } catch (error) {
          data.finance = undefined
        }
      }

      // 域名标准
      if (process.env.VUE_APP_CORRECT_DOMAIN === '1') {
        await correctDomain()
      }

      if (Object.keys(data.crm).length === 0) {
        delete data.crm
      }

      set('authList', data)
      data.wkFirstModel = data.firstModel
      this.SET_ALLAUTH(data)
      this.SET_CRM(data.crm)
      this.SET_BI(data.bi)
      this.SET_MANAGE(data.manage)
      this.SET_OA(data.oa)
      this.SET_PROJECT(data.project)
      this.SET_EMAIL(data.email)
      this.SET_KNOWLEDGE(data.knowledge)
      this.SET_HRM(data.hrm)
      this.SET_JXC(data.jxc)
      this.SET_FINANCE(data.finance)
      // 获取 管理后台 员工和部门信息
      this.GetUserList()
      this.GetDeptList()
      this.GetUserDepMap()

      // if (data.hrm) {
      //   dispatch('GetHrmUserList')
      //   dispatch('GetHrmDeptList')
      // }

      return Promise.resolve(data)
    },

    // 获取用户信息
    async GetUserInfo() {
      return new Promise((resolve, reject) => {
        adminUsersReadAPI()
          .then((res) => {
            // // 开启了小程序
            // if (response && response.hasOwnProperty('cardAuth')) {
            //   response.data.cardAuth = response.cardAuth
            // }

            const resData = res.data || {}
            const adminToken = resData.adminToken
            if (resData.initToken && adminToken) {
              cache.updateAxiosCache(adminToken)
            }
            // 邮件信息 走之前的逻辑
            // commit('SET_USERINFO', resData)
            this.SET_USERINFO(resData)

            const useApp = useAppStore()
            useApp.SystemLogoAndName()
            // dispatch('SystemLogoAndName')

            resolve(res)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    // 获取邮箱number
    async GetEmailCount({ commit }) {
      try {
        const response = await emailNumAPI()
        commit('SET_EMAIL_NUMBER', response.data)
        return response
      } catch {
        console.log('user-store-error')
      }
      // return new Promise((resolve, reject) => {
      //   emailNumAPI()
      //     .then((response) => {
      //       commit('SET_EMAIL_NUMBER', response.data)
      //       resolve(response)
      //     })
      //     .catch((error) => {
      //       reject(error)
      //     })
      // })
    },

    // 登出
    async LogOut() {
      try {
        await logoutAPI()
      } finally {
        removeAuth({
          clearCookies: true
        })
      }
      // return new Promise((resolve, reject) => {
      //   logoutAPI()
      //     .then(() => {
      //       /** flush 清空localStorage .rm('authKey') 按照key清除 */
      //       removeAuth({
      //         clearCookies: true
      //       })
      //       // resetRouter()
      //       resolve('')
      //     })
      //     .catch((error) => {
      //       removeAuth({
      //         clearCookies: true
      //       })
      //       // resetRouter()
      //       reject(error)
      //     })
      // })
    },

    debounceGetUserList: debounce(3000, ({ dispatch }) => {
      dispatch('GetUserList')
    }),

    // 管理后台员工列表
    async GetUserList() {
      return new Promise((resolve, reject) => {
        userListAPI({
          pageType: 0
        })
          .then((res) => {
            this.SET_USERLIST(res.data.list || [])
            resolve('')
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    async GetUserDepMap() {
      return new Promise((resolve, reject) => {
        adminUserQueryOrgInfoAPI()
          .then((res) => {
            const resData = res.data || {}
            this.SET_USERDEPTOBJ(resData)
            this.SET_USERDEPTMAP(resData)
            resolve(resData)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    debounceGetDeptList: debounce(3000, ({ dispatch }) => {
      dispatch('GetDeptList')
    }),

    // 管理后台部门列表
    async GetDeptList() {
      return new Promise((resolve, reject) => {
        depListAPI({ type: 'tree' })
          .then((res) => {
            this.SET_DEPTLIST(res.data || [])
            resolve('')
          })
          .catch((error) => {
            reject(error)
          })
      })
    }
  }
})
