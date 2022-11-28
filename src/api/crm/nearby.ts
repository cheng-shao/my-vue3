

/**
 * 地图查询接口
 * @param {*} data
 */
export function crmCrmCustomerNearbyCustomerAPI(data) {
  return request({
    url: 'crmCustomer/nearbyCustomer',
    method: 'post',
    data: data
  })
}
