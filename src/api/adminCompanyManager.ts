/**
 * 域名配置
 * @param {*} data
 */
export function adminCompanyManagerSetDomainAPI(data) {
  return request({
    url: 'adminCompanyManager/setCompanyDoMain',
    method: 'post',
    data: data
  })
}

/**
 * 根据域名查询logo和名称
 * @param {*} data
 */
export function adminCompanyManagerQueryLogoAPI(data) {
  return request({
    url: 'adminCompanyManager/queryCompanyLogoByDomain',
    method: 'post',
    data: data
  })
}

/**
 * @description: 查询企业邮箱是否验证
 * @param {*}
 * @return {*} adminUser 是否是管理员 expired 是否已过期 verify 是否已验证
 */
export function adminCompanyManagerEmailInfoAPI() {
  return request({
    url: 'adminCompanyManager/queryEmailInfo',
    method: 'post'
  })
}

/**
 * @description: 发送邮件进行验证
 * @param {*} email
 * @return {*}
 */
export function adminCompanyManagerSetEmailAPI(email) {
  return request({
    url: 'adminCompanyManager/setEmailInfo',
    method: 'post',
    data: { email }
  })
}

/**
 * @description: 验证邮箱信息
 * @param {*} k 邮箱跳转进入时携带的参数
 * @return {*}
 */
export function adminCompanyManagerVerifyEmailAPI(k) {
  return request({
    url: `adminCompanyManager/verifyEmailInfo/?k=${k}`,
    method: 'get'
  })
}
