import qs from 'qs'
import { router } from '../router'

//
// axios 0.18 支持不过滤掉自定义参数
// requestProp 额外的一些说明,与 data  method 同级
// disabledMessage 禁用消息弹框
//
/**
 * 检查dom是否忽略
 * @param {*} e
 */
const clearCacheEnterLogin = debounce(500, () => {
  // 已经在登录页面不清空
  const currentRoute = window.app.$route
  if (currentRoute && currentRoute.name === 'login') {
    return
  }

  removeAuth({
    clearCookies: true
  })
    .then(() => {
      location.reload() // 为了重新实例化vue-router对象 避免bug
    })
    .catch(() => {
      location.reload()
    })
})

const errorMessage = debounce(500, (message, type = 'error') => {
  ElMessage({
    message: message,
    duration: 1500,
    type: type
  })
})

const confirmMessage = debounce(1000, (message) => {
  ElMessageBox.confirm(message, '提示', {
    confirmButtonText: '确定',
    showCancelButton: false,
    closeOnClickModal: false,
    closeOnPressEscape: false,
    showClose: false,
    type: 'warning'
  })
    .then(() => {
      if (
        (window.app.$route && window.app.$route.name !== 'login') ||
        !window.app.$route
      ) {
        clearCacheEnterLogin()
      } else {
        removeAuth({
          clearCookies: true
        })
      }
    })
    .catch(() => {})
})

axios.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded;charset=UTF-8'

// 创建axios实例
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API, // api 的 base_url
  timeout: 600000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  (config) => {
    if (!config.url) return

    config.headers = {
      ...axios.defaults.headers,
      ...config.headers
    }

    const flag =
      config.headers['Content-Type'] &&
      config.headers['Content-Type'].indexOf('application/json') !== -1
    if (!flag) {
      const mult =
        config.headers['Content-Type'] &&
        config.headers['Content-Type'].indexOf('multipart/form-data') !== -1
      if (!mult) {
        config.data = qs.stringify(config.data)
      }
    } else {
      if (config.data === undefined || config.data === null) {
        // 不传参的情况下 json类型的提交数据，校准为 空对象
        config.data = {}
      }
    }

    // const validUrl = config.url ? config.url.toLowerCase() : ''
    // if (
    //   !validUrl.includes('admin') &&
    //   !validUrl.includes('financeauth') &&
    //   !validUrl.includes('queryallemployeelist') &&
    //   !validUrl.includes('querytreelist') &&
    //   !validUrl.includes('login')
    // ) {
    //   config.cancelToken = new axios.CancelToken(function (cancel) {
    //     store.commit('SET_CANCELTOKENARR', { cancelToken: cancel })
    //   })
    // }
    return config
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  (response) => {
    const requestProp = response.config.requestProp || {} // 请求配置
    /**
     * code为非20000是抛错 可结合自己业务进行修改
     */
    const res = response.data
    if (response.status === 200 && response.config.responseType === 'blob') {
      // 文件类型特殊处理
      if (
        response.headers['content-disposition'] ||
        (response.headers['content-type'] &&
          response.headers['content-type'].indexOf('application/pdf') != -1)
      ) {
        return response
      } else if (response.data) {
        const resultBlob = new Blob([response.data], {
          type: 'application/json'
        })
        const fr = new FileReader()
        fr.onload = function () {
          if (this.result) {
            const result = JSON.parse(this.result)
            // 附件下载反馈的302 忽略
            if (result.msg && result.code !== 302) {
              errorMessage(result.msg, result.code == 1 ? 'success' : 'error')
            }
          }
        }
        fr.readAsText(resultBlob)
      }
    } else if (res.code !== 0) {
      // 302	登录已失效
      if (res.code === 302) {
        if (res.data && res.data.extra === 1) {
          confirmMessage(
            `您的账号${res.data.extraTime}在别处登录。如非本人操作，则密码可能已泄漏，建议修改密码`
          )
        } else {
          clearCacheEnterLogin()
        }
      } else if (res.code === 1005) {
        removeAuth()
          .then(() => {
            window.accessLogin = true
            setTimeout(() => {
              router.push(
                `/login?type=perfect&mobile=${
                  res.data
                }&time=${new Date().getTime()}`
              )
            }, 500)
          })
          .catch(() => {})
      } else if (res.code === 1007) {
        // 该企业没有该用户
        // 忽略Cookies 读取
        window.sessionStorage.wkIgnoreCookies = true
        errorMessage(res.msg)
        router.push('/login')
      } else {
        if (res.msg && !requestProp.disabledMessage) {
          errorMessage(res.msg)
        }
      }
      return Promise.reject(res)
    } else {
      return res
    }
  },
  (error) => {
    if (!axios.isCancel(error)) {
      // 取消请求的情况下，终端Promise调用链
      if (error.response) {
        const response = error.response
        if (response.status == 500) {
          errorMessage('网络错误，请检查您的网络')
        } else if (response.data && response.data.msg) {
          errorMessage(response.data.msg)
        }
      }
      return Promise.reject(error)
    }
  }
)

export default service
