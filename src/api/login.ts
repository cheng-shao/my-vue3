export function loginAPI(params) {
  return request({
    url: '/login',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 旧版本登录
 * @param {*} params
 * @returns
 */
export function oldLoginAPI(params) {
  const oldUrl =
    window.location.protocol + '//' + window.location.hostname + '/api'
  return request({
    url: oldUrl + '/login',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function logoutAPI() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

/**
 * 获取短信验证码
 * @param params
 */
export function sendSmsAPI(params) {
  return request({
    url: 'cloud/sendSms',
    method: 'post',
    data: params
  })
}

/**
 * 注册
 * @param params
 */
export function registerAPI(params) {
  return request({
    url: 'cloud/register',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 完善注册
 * @param params
 */
export function serverRegisterAPI(params) {
  return request({
    url: 'cloud/serverRegister',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 多公司选择登陆
 * @param params
 */
export function chooseLoginAPI(params) {
  return request({
    url: 'reLogin',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 找回密码
 * @param params
 */
export function forgetPwdAPI(params) {
  return request({
    url: 'cloud/findpwd',
    method: 'post',
    data: params
  })
}

/**
 * 重置密码
 * @param params
 */
export function resetPwdAPI(params) {
  return request({
    url: 'cloud/resetpwd',
    method: 'post',
    data: params
  })
}

/**
 * 验证短信验证码
 * @param params
 */
export function verfySmsAPI(params) {
  return request({
    url: 'cloud/verifySms',
    method: 'post',
    data: params
  })
}

/**
 * 验证
 * @param params
 */
export function verfyCodeAPI(params) {
  return request({
    url: 'verfyCode',
    method: 'post',
    data: params
  })
}

/**
 * 获取公司logo
 * @param params
 */
export function doLoginGetLoGoAPI(params) {
  return request({
    url: '/doLoginGetLoGo',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 重置主账号手机号
 * @param params
 */
export function resetManagerUserAPI(params) {
  return request({
    url: 'adminCompanyManager/resetManagerUser',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
