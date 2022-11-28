

/**
 * 应用列表接口
 * @param {*} data
 *
 */
export function adminConfigsetIndexAPI() {
  return request({
    url: 'adminConfig/queryModuleSetting',
    method: 'post'
  })
}

/**
 * 应用状态改变
 * @param {*} data
 * id 应用ID
 * status 1开启 0关闭
 */
export function adminConfigsetUpdateAPI(data) {
  return request({
    url: 'adminConfig/setModuleSetting',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 试用应用
 * @param {*}
 */
export function adminPayTryUseModuleListAPI(data) {
  return request({
    url: 'adminPay/tryUseModuleList ',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
