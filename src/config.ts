const getLocationOrigin = () => {
  return (
    window.location.protocol +
    '//' +
    window.location.hostname +
    (window.location.port ? ':' + window.location.port : '')
  )
}
const macUrl =
  'https://www.5kcrm.com/download/desktop/mac/%E6%82%9F%E7%A9%BACRM.dmg'
const winUrl =
  'https://www.5kcrm.com/download/desktop/win/%E6%82%9F%E7%A9%BACRM.exe'
const iOSUrl =
  'https://apps.apple.com/cn/app/%E6%82%9F%E7%A9%BAcrm-10-0/id1489143707'
const androidUrl =
  'https://sj.qq.com/myapp/detail.htm?apkName=com.kakarote.crm10'

const registerUrl = `${getLocationOrigin()}/#/register/index`
const contactUrl = 'https://www.72crm.com/contact' // 联系我们

const companyName = '悟空CRM'
const version = 'V12.0.0'
const baiduKey = 'lcuOQ71SCZhqpxsr1vL2mXoplWEoVctL'

const build = 20220110

// 默认表格样式
const tableStyle = {
  stripe: true, // 斑马纹
  class: [] // 'is-right-border-style', 'is-bottom-border-style'
}

export default {
  version,
  build,
  companyName,
  getLocationOrigin,
  baiduKey,
  macUrl,
  winUrl,
  iOSUrl,
  androidUrl,
  registerUrl,
  tableStyle,
  contactUrl
}
