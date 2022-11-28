

/**
 * 企业首页
 * @param {*} data
 */
export function adminSystemSaveAPI(data) {
  return request({
    url: 'adminConfig/setAdminConfig',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 企业首页
 * @param {*} data
 */
export function adminSystemIndexAPI() {
  return request({
    url: 'adminConfig/queryAdminConfig',
    method: 'post'
  })
}

/**
 * 系统信息
 * @param {*} data
 */
export function adminSystemConfigIndexAPI() {
  return request({
    url: 'adminConfig/queryCloudConfig',
    method: 'post'
  })
}

/**
 * 呼叫中心是否开启
 * @param {*} data
 */
export function adminSystemCallSetAPI(data) {
  return request({
    url: 'adminConfig/queryCallModuleSetting',
    method: 'post',
    data: data
  })
}

// /**
//  * 忽略系统消息
//  * @param {*} data
//  */
// export function adminConfigIgnoreCompanyStatusAPI() {
//   return request({
//     url: 'adminConfig/ignoreCompanyStatus',
//     method: 'post'
//   })
// }

/**
 * 查询自定义配置
 * @param {*} data
 * CRM下的模块按照 pcCRM + crmType 的规则
 */
export const PcCustomKeys = {
  pcRegisterStatistics: 'pcRegisterStatistics', // 注册页面配置信息
  pcCRMprefix: 'pcCRM'
}

export function adminConfigQueryCustomSettingAPI(key) {
  return request({
    url: `adminConfig/queryCustomSetting/${key}`,
    method: 'post'
  })
}

/**
 * 设置自定义配置
 * @param {*} data
 */
export function adminConfigSetCustomSettingAPI(key, data) {
  return request({
    url: `adminConfig/setCustomSetting/${key}`,
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
