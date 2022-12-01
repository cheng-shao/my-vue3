/**
 * 时间戳到格式化时间
 * {{item.createTime|filterTimestampToFormatTime('MM-DD dddd')}}
 * @param {*} time
 * @param {*} cFormat
 */
export function filterTimestampToFormatTime(time, cFormat) {
  if (!cFormat) {
    cFormat = 'YYYY-MM-DD HH:mm'
  }
  if (!time || time == 0) {
    return ''
  }
  return timeToFormatTime(time, cFormat)
}

/** 格式化时间到时间戳 */
export function filterFormatTimeToTimestamp(format) {
  return formatTimeToTimestamp(format)
}

/** 用户头像的占位图标 */
export function filterUserLazyImg(value) {
  return {
    src: value,
    error: require('@/assets/img/head.png'),
    loading: require('@/assets/img/loading.gif')
  }
}

/**
 * wk 10.0 iconfont 前缀
 */
export function wkIconPre(name) {
  return name.startsWith('wk') ? name : `wk wk-${name}`
}

import numeral from 'numeral'

const abbreviate = (value) => numeral(value).format('0.0a')

const bytes = (value) => numeral(value).format('0 b')

const exposedNumeral = (value, format) => numeral(value).format(format)

const exponential = (value) => numeral(value).format('0.[00]e+0')

const ordinal = (value) => numeral(value).format('Oo')

const percentage = (value) => numeral(value).format('0.[00]%')

const separator = (value) => {
  if (value === '' || value === null || value === undefined) {
    return ''
  }
  const valueStr = value.toString()
  const index = valueStr.indexOf('.')
  if (index == -1) {
    return numeral(value).format('0,0.00')
  } else {
    const values = valueStr.split('.')
    const decimals = values[1].padEnd(2, '0')
    return numeral(values[0]).format('0,0') + '.' + decimals
  }
}

const separatorInt = (value) => numeral(value).format('0,0')

const currency = (value) => numeral(value).format('$0,0.00')

export {
  abbreviate,
  bytes,
  exponential,
  exposedNumeral,
  ordinal,
  percentage,
  separator,
  separatorInt,
  currency
}
