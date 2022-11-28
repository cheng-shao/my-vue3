/**
 * Created by jiachenpan on 16/11/18.
 */

export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/** 压缩文件
 * quality压缩百分比 0.3
 */
export function compressImage(file, quality, callback) {
  // quality 设置为0.3
  quality = quality || 0.3
  const reader = new FileReader()
  reader.onload = function (event) {
    const result = event.target.result
    if (file.size > 204800 && file.type !== 'image/gif' && quality < 1) {
      // 大于200Kb
      const img = new Image()
      img.src = result
      img.onload = function () {
        // // 如果图片大于四百万像素，计算压缩比并将大小压至400万以下
        // var initSize = img.src.length
        let width = img.width
        let height = img.height

        let ratio
        if ((ratio = (width * height) / 4000000) > 1) {
          ratio = Math.sqrt(ratio)
          width /= ratio
          height /= ratio
        } else {
          ratio = 1
        }
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        // 铺底色
        const ctx = canvas.getContext('2d')
        ctx.fillStyle = '#fff'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        // 如果图片像素大于100万则使用瓦片绘制
        let count
        if ((count = (width * height) / 1000000) > 1) {
          count = ~~(Math.sqrt(count) + 1)
          // 计算要分成多少块瓦片
          // 计算每块瓦片的宽和高
          const nw = ~~(width / count)
          const nh = ~~(height / count)
          const tCanvas = document.createElement('canvas')
          tCanvas.width = nw
          tCanvas.height = nh
          for (let i = 0; i < count; i++) {
            for (let j = 0; j < count; j++) {
              const tctx = tCanvas.getContext('2d')
              tctx.drawImage(
                img,
                i * nw * ratio,
                j * nh * ratio,
                nw * ratio,
                nh * ratio,
                0,
                0,
                nw,
                nh
              )

              ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh)
            }
          }
          tCanvas.width = tCanvas.height = 0
        } else {
          ctx.drawImage(img, 0, 0, width, height)
        }
        // 进行最小压缩
        const ndata = canvas.toDataURL('image/jpeg', quality)
        canvas.width = canvas.height = 0
        callback(ndata)
      }
    } else {
      // 小于200K不需要压缩 直接返回
      callback(result)
    }
  }
  reader.readAsDataURL(file)
}

/**
 * 获取date类型展示时间
 * @param {*} time
 */
export function getWkDateTime(time) {
  if (time) {
    const temps = time.split(' ')
    return temps.length > 0 ? temps[0] : ''
  }
  return time
}

/** 根据date URL 创建blob 用于上传 */
export function createBlob(result) {
  const arr = result.split(',')
  const mime = arr[0].match(/:(.*?)/)[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([u8arr], {
    type: mime
  })
}

/** 获取file大小的名称 */
export function fileSize(value) {
  if (!value || value == 0) {
    return '0 Bytes'
  }
  if (isNaN(Number(value))) return value
  const unitArr = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  let index = 0
  const srcsize = parseFloat(value)
  index = Math.floor(Math.log(srcsize) / Math.log(1024))
  let size = srcsize / Math.pow(1024, index)
  //  保留的小数位数
  size = size.toFixed(2)
  return size + unitArr[index]
}

/** 获取最大 z-index 的值 */
import { useZIndex } from 'element-plus'
export function getMaxIndex() {
  const { nextZIndex } = useZIndex()
  return nextZIndex()
}

/** 深拷贝 */
export function objDeepCopy(source) {
  if (typeof source === 'object') {
    const sourceCopy = source instanceof Array ? [] : {}
    for (const item in source) {
      if (!source[item]) {
        sourceCopy[item] = source[item]
      } else {
        sourceCopy[item] =
          typeof source[item] === 'object'
            ? objDeepCopy(source[item])
            : source[item]
      }
    }
    return sourceCopy
  }
  return source
}

/**
 * 获取文件类型图标
 * @param {*} file
 */
export function getFileTypeIcon(file) {
  if (file.type.indexOf('image') !== -1) {
    return getFileIconWithSuffix('png')
  } else if (file.type.indexOf('audio') !== -1) {
    return getFileIconWithSuffix('mp3')
  } else if (file.type.indexOf('video') !== -1) {
    return getFileIconWithSuffix('mp4')
  } else {
    const index = file.name.lastIndexOf('.')
    const ext = file.name.substr(index + 1) || ''

    return getFileIconWithSuffix(ext)
  }
}

/**
 * @description: 是压缩文件
 * @param {*} ext 后缀 或者 带后缀文件名
 * @return {*}
 */
export function isRAR(name) {
  const temps = name ? name.split('.') : []
  let ext = ''
  if (temps.length > 0) {
    ext = temps[temps.length - 1]
  } else {
    ext = ''
  }
  return ['7z', 'rar', 'zip'].includes(ext)
}

/**
 * 根据文件名字判断是否能预览
 * @param {*} name
 */
export function canPreviewFile(name) {
  return false
}

/**
 * 预览文件
 */
import axios from 'axios'
export function wkPreviewFile(path, name) {
  window.open(wkPreviewFileUrl(path, name))
}

export function wkPreviewFileUrl(path, name) {
  return `${WKConfig.getLocationOrigin()}/file/preview?url=${encodeURIComponent(
    `${path}${
      path.includes('?fullfilename=') ? '' : `?fullfilename=${name || ''}`
    }&c=${axios.defaults.headers['token']}`
  )}`
}

export function getFileIconWithSuffix(ext) {
  const fileType = getFileTypeWithExt(ext)
  if (fileType) {
    return (
      {
        image: require('@/assets/img/file/file_img.png'),
        tif: require('@/assets/img/file/file_tif.png'),
        video: require('@/assets/img/file/file_video.png'),
        audio: require('@/assets/img/file/file_music.png'),
        excel: require('@/assets/img/file/file_excle.png'),
        word: require('@/assets/img/file/file_word.png'),
        archive: require('@/assets/img/file/file_zip.png'),
        pdf: require('@/assets/img/file/file_pdf.png'),
        ppt: require('@/assets/img/file/file_ppt.png'),
        text: require('@/assets/img/file/file_txt.png')
      }[fileType] || require('@/assets/img/file/file_unknown.png')
    )
  }

  return require('@/assets/img/file/file_unknown.png')
}

/**
 * 获取文件类型根据文件名
 * @param {*} file
 */
export function getFileIconWithFileName(fileName) {
  if (fileName) {
    const index = fileName.lastIndexOf('.')
    const ext = fileName.substr(index + 1) || ''
    return getFileIconWithSuffix(ext)
  }
  return ''
}

import { ElMessage } from 'element-plus'
/**
 * 根据文件名验证文件是否通过
 * @param {*} fileName 文件名
 * @param {*} type 要求的文件类型
 * @param {*} messageShow 展示消息
 */
export function verifyFileTypeWithFileName(
  fileName,
  type = 'excel',
  messageShow = true
) {
  let pass = true
  if (fileName) {
    const index = fileName.lastIndexOf('.')
    const ext = fileName.substr(index + 1) || ''
    const fileType = getFileTypeWithExt(ext)
    if (fileType != type) {
      pass = false
    }
  } else {
    pass = false
  }

  if (!pass && messageShow) {
    ElMessage({
      message: '请选择正确的文件类型',
      type: 'error'
    })
  }
  return pass
}

/**
 * 根据后缀获取文件类型
 * @param {*} ext
 */
export function getFileTypeWithExt(ext) {
  if (ext) {
    ext = ext.toLowerCase()
    if (['jpg', 'png', 'jpeg', 'bmp', 'ico', 'gif'].includes(ext)) {
      return 'image'
    } else if (ext === 'psd') {
      return 'psd'
    } else if (ext === 'tif') {
      return 'tif'
    } else if (
      ['mp4', 'm2v', 'mkv', 'rmvb', 'wmv', 'avi', 'flv', 'mov', '3gp'].includes(
        ext
      )
    ) {
      return 'video'
    } else if (['mp3', 'wma', 'wav'].includes(ext)) {
      return 'audio'
    } else if (['xlsx', 'xls'].includes(ext)) {
      return 'excel'
    } else if (['doc', 'docx'].includes(ext)) {
      return 'word'
    } else if (['rar', 'zip', '7z', 'tar', 'iso', 'dmg'].includes(ext)) {
      return 'archive'
    } else if (ext === 'pdf') {
      return 'pdf'
    } else if (['ppt', 'pptx'].includes(ext)) {
      return 'ppt'
    } else if (['txt', 'text'].includes(ext)) {
      return 'text'
    }
  }
  return ''
}

/** 判断输入的是number */
export function regexIsNumber(nubmer) {
  const regex = /^[0-9]+.?[0-9]*/
  if (!regex.test(nubmer)) {
    return false
  }
  return true
}

/** 判断输入的是crm数字 数字的整数部分须少于15位，小数部分须少于4位*/
export function regexIsCRMNumber(nubmer) {
  const regex = /^([-+]?\d{1,15})(\.\d{0,4})?$/
  if (!regex.test(nubmer)) {
    return false
  }
  return true
}

/** 判断输入的是货币 货币的整数部分须少于15位，小数部分须少于2位*/
export function regexIsCRMMoneyNumber(nubmer) {
  const regex = /^([-+]?\d{1,15})(\.\d{0,2})?$/
  if (!regex.test(nubmer)) {
    return false
  }
  return true
}

/** 判断输入的是电话*/
export function regexIsCRMMobile(mobile) {
  const regex = /^(\+?0?\d{2,4}\-?)?\d{6,11}$/
  if (!regex.test(mobile)) {
    return false
  }
  return true
}

// 中国手机号
export const chinaMobileRegex = /^1\d{10}$/

// 密码检测正则
export const checkPasswordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{6,20}$/

// 验证输入的邮箱是否合格的正则
export const emailRegex =
  /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/

// 域名名称
export const domainNameRegex = /^[0-9a-zA-Z]{1}[0-9a-zA-Z-]{2,29}$/

/** 判断输入的是邮箱*/
export function regexIsCRMEmail(email) {
  if (!emailRegex.test(email)) {
    return false
  }
  return true
}

/**
 * 时间操作
 * @param
 */
/** 时间戳转date*/
import moment from 'moment'

export function formatTime(time) {
  const timeMoment = moment(time)
  const nowMoment = moment()
  const diff = nowMoment.diff(timeMoment, 'seconds')

  const minute = 60
  const hour = minute * 60
  const day = hour * 24
  // var halfamonth = day * 15
  const month = day * 30

  const monthC = diff / month
  const weekC = diff / (7 * day)
  const dayC = diff / day
  const hourC = diff / hour
  const minC = diff / minute

  if (monthC >= 1) {
    if (monthC > 11) {
      return timeMoment.format('YY年MM月DD日')
    } else {
      return parseInt(monthC) + '月前'
    }
  } else if (weekC >= 1) {
    return parseInt(weekC) + '周前'
  } else if (dayC >= 1) {
    return parseInt(dayC) + '天前'
  } else if (hourC >= 1) {
    return parseInt(hourC) + '小时前'
  } else if (minC >= 1) {
    return parseInt(minC) + '分钟前'
  } else {
    return '刚刚'
  }

  // if (diff < 30) {
  //   return '刚刚'
  // } else if (diff < 3600) {
  //   // less 1 hour
  //   return Math.ceil(diff / 60) + '分钟前'
  // } else if (diff < 3600 * 24) {
  //   return Math.ceil(diff / 3600) + '小时前'
  // } else if (diff < 3600 * 24 * 2) {
  //   return '1天前'
  // }

  // const timeYear = timeMoment.format('YYYY')
  // const nowYear = nowMoment.format('YYYY')

  // if (timeYear == nowYear) {
  //   return timeMoment.format('MM月DD日')
  // } else {
  //   return timeMoment.format('YY年MM月DD日')
  // }
}

// date 或者格式化时间
export function timeToFormatTime(time, format) {
  if (time) {
    let momentObj = ''
    if (isNaN(time)) {
      // 如果误传非数字时间，直接当做格式化时间处理
      momentObj = moment(time)
    } else {
      momentObj = moment(typeof time === 'number' ? time : parseInt(time))
    }
    return momentObj.isValid() ? momentObj.format(format || 'YYYY-MM-DD') : ''
  }
  return ''
}

/**
 *
 * @param {*} format 格式化字符串
 */
export function formatTimeToTimestamp(format) {
  if (format && format.length > 0) {
    const timeValue = moment(format).valueOf().toString()
    return timeValue.length > 10 ? timeValue.substr(0, 10) : timeValue
  }
  return ''
}

/** image 下载 */

/**
 *
 * @param {*} data url
 * @param {*} filename 名称
 */
export function getImageData(url) {
  return new Promise((resolve, reject) => {
    let request = null
    if (url && url.indexOf('adminFile/down/') !== -1) {
      request = adminFileDownByUrlAPI
    } else {
      request = downloadFileAPI
    }
    request(url)
      .then((res) => {
        const blob = new Blob([res.data], {
          type: ''
        })
        const reader = new FileReader()
        reader.readAsDataURL(blob)
        reader.onload = (evt) => {
          resolve({
            blob: blob,
            src: evt.target.result
          })
        }
      })
      .catch(() => {
        reject()
      })
  })
}

/**
 * path  和 name
 */
export function downloadFile(data) {
  downloadFileAPI(data.path)
    .then((res) => {
      const blob = new Blob([res.data], {
        type: ''
      })
      downloadFileWithBuffer(blob, data.name || '文件')
    })
    .catch(() => {})
}

export function dataURLtoBlob(dataurl) {
  // eslint-disable-next-line one-var
  let arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([u8arr], {
    type: mime
  })
}

export function getBase64Image(img) {
  const canvas = document.createElement('canvas')
  canvas.width = img.width
  canvas.height = img.height
  const ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0, img.width, img.height)
  const ext = img.src.substring(img.src.lastIndexOf('.') + 1).toLowerCase()
  const dataURL = canvas.toDataURL('image/' + ext)
  return dataURL
}

// 获取绑定参数
export function guid() {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  }
  return S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4()
}

import JsEncrypt from 'jsencrypt'

export function RSAencrypt(pas) {
  const publicKey =
    '-----BEGIN PUBLIC KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAzaLc7XHaYpVOR2UtBeyXdVW5wLKpHulw/8KMW61Qa/RcVykhkbb0QAwxqSTUu9L6gS2c8WqLjnKOJB+FZfrATuHGzKrPuBgToMWA7XlcSf1P9TH3Kz6SziM/qQeIo4HigbsOZTiYWl01ds5Mj/x63npOehmrf0Q5CIymrqZfNGaS7VHXoNe5U3nPxeYw2PmXL7O2qt3jIm/HUQDdu0DyBtkS3JehCt8ZBHCHkjBeHO1XJvZuplU4a4+N/J0M+GzkJBoDe3ZQGlECsXItfHxb4RGex7XvbeFdB/xkHS23avvXFNTqU1ZLoYSWbjkaEXV8RHvkIYBpIvqdEtKRI6JlNwIDAQAB-----END PUBLIC KEY-----'
  // 实例化jsEncrypt对象
  const jse = new JsEncrypt()
  // 设置公钥
  jse.setPublicKey(publicKey)
  return jse.encrypt(pas)
}

import { read, utils } from 'xlsx'
export function getExcelLines(file) {
  const reader = new FileReader() // 读取操作就是由它完成.
  reader.readAsBinaryString(file) // 读取文件的内容,也可以读取文件的URL
  reader.onload = function (evt) {
    // 当读取完成后回调这个函数,然后此时文件的内容存储到了result中,直接操作即可
    try {
      const data = evt.target.result
      const workbook = read(data, {
        type: 'binary'
      }) // 以二进制流方式读取得到整份excel表格对象
      let buildings = [] // 存储获取到的数据
      // var fromTo = ''
      // 遍历每张表读取
      for (const sheet in workbook.Sheets) {
        if (workbook.Sheets.hasOwnProperty(sheet)) {
          // fromTo = workbook.Sheets[sheet]['!ref']
          buildings = buildings.concat(
            utils.sheet_to_json(workbook.Sheets[sheet])
          )
          break // 如果只取第一张sheet表，就取消注释这行
        }
      }
      const fileRows = buildings.length - 1 // 表格内容行数，减去表头的一行

      return fileRows
    } catch (e) {
      console.log('文件类型不正确', e)
      return
    }
  }
}

/**
 * 两个浮点数求和
 * @param num1
 * @param num2
 * @return {number}
 */
export function floatAdd(num1, num2) {
  let r1, r2
  try {
    r1 = num1.toString().split('.')[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = num2.toString().split('.')[1].length
  } catch (e) {
    r2 = 0
  }
  const m = Math.pow(10, Math.max(r1, r2))
  return Math.round(num1 * m + num2 * m) / m
}

/**
 * 下载excel
 */
export function downloadExcelWithResData(res) {
  let fileName = res.headers['content-disposition'].split('filename=')[1]
  if (!fileName) {
    fileName = res.headers['content-disposition'].split("UTF-8''")[1]
  }
  fileName = fileName ? fileName.replace(/\"/g, '') : 'file.xlsx'
  fileName = decodeURI(fileName) || ''
  downloadFileWithBuffer(
    res.data,
    fileName,
    'application/vnd.ms-excel;charset=utf-8'
  )
}

export function downloadFileWithBuffer(data, name, type) {
  const blob = new Blob([data], {
    type: type || ''
  })
  const downloadElement = document.createElement('a')
  const href = window.URL.createObjectURL(blob) // 创建下载的链接
  downloadElement.href = href
  downloadElement.download = name // 下载后文件名
  document.body.appendChild(downloadElement)
  downloadElement.click() // 点击下载
  document.body.removeChild(downloadElement) // 下载完成移除元素
  window.URL.revokeObjectURL(href) // 释放掉blob对象
}

import FileSaver from 'file-saver'
/**
 * 导出ElTable表格
 * @param {*} name
 */
export function exportElTable(name, domId) {
  const fix = document.querySelector('.el-table__fixed')
  let wb
  if (fix) {
    document.getElementById(domId).removeChild(fix)
    wb = XLSX.utils.table_to_book(document.getElementById(domId))
    document.getElementById(domId).appendChild(fix)
  } else {
    wb = XLSX.utils.table_to_book(document.getElementById(domId))
  }
  const wopts = {
    bookType: 'xlsx',
    bookSST: false,
    type: 'binary'
  }
  const wbout = XLSX.write(wb, wopts)

  FileSaver.saveAs(
    new Blob([s2ab(wbout)], {
      type: 'application/octet-stream;charset=utf-8'
    }),
    name
  )
}

function s2ab(s) {
  let cuf
  let i
  if (typeof ArrayBuffer !== 'undefined') {
    cuf = new ArrayBuffer(s.length)
    const view = new Uint8Array(cuf)
    for (i = 0; i !== s.length; i++) {
      view[i] = s.charCodeAt(i) & 0xff
    }
    return cuf
  } else {
    cuf = new Array(s.length)
    for (i = 0; i !== s.length; ++i) {
      cuf[i] = s.charCodeAt(i) & 0xff
    }
    return cuf
  }
}

/**
 * 获取百度地图
 */
export function getBaiduMap() {
  if (!global.BMap) {
    global.BMap = {}
    global.BMap._preloader = new Promise((resolve, reject) => {
      global._initBaiduMap = function () {
        resolve(global.BMap)
        global.document.body.removeChild($script)
        global.BMap._preloader = null
        global._initBaiduMap = null
      }
      const $script = document.createElement('script')
      global.document.body.appendChild($script)
      $script.src = `https://api.map.baidu.com/api?v=3.0&ak=${WKConfig.baiduKey}&callback=_initBaiduMap`
    })
    return global.BMap._preloader
  } else if (!global.BMap._preloader) {
    return Promise.resolve(global.BMap)
  } else {
    return global.BMap._preloader
  }
}
/** 将url转化为img对象 */
export function urltoImage(url, fn) {
  const img = new Image()
  img.src = url
  return img
}
/** img对象转化为canvas对象 */
export function imagetoCanvas(image) {
  const cvs = document.createElement('canvas')
  const ctx = cvs.getContext('2d')
  cvs.width = image.width
  cvs.height = image.height
  ctx.drawImage(image, 0, 0, cvs.width, cvs.height)
  return cvs
}

export function canvasToDataURL(canvas, format, quality) {
  return canvas.toDataURL(format || 'image/jpeg', quality || 1.0)
}

/**
 * file Path to blob
 */
export function filePathToBlob(filePath) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('get', filePath, true)
    xhr.responseType = 'blob'
    xhr.onload = function () {
      if (this.status == 200) {
        resolve(this.response)
      } else {
        reject()
      }
    }
    xhr.send()
  })
}

/**
 * 获取树形接口的值
 */
export function getTreeValue(id, treeList, key = 'id', children = 'children') {
  const resultList = []
  loopTree(id, treeList, resultList, key, children)
  return resultList.reverse()
}

function loopTree(id, treeList, resultList, key, children) {
  for (let i = 0; i < treeList.length; i++) {
    if (treeList[i][key] == id) {
      resultList.push(treeList[i][key])
      return true
    } else {
      if (treeList[i][children] && treeList[i][children].length > 0) {
        if (loopTree(id, treeList[i][children], resultList, key, children)) {
          resultList.push(treeList[i][key])
          return true
        }
      }
    }
  }
}

/**
 * 判断是手机
 */
export function isMobileDevice() {
  if (/(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent)) {
    return true
  }
  return false
}

/**
 * 判断是微信
 */
export function isWeiXin() {
  const ua = window.navigator.userAgent.toLowerCase()
  if (ua.match(/MicroMessenger/i) == 'micromessenger') {
    return true
  } else {
    return false
  }
}

/**
 * 下划线转换驼峰
 */
export function toCamelCase(name) {
  return name.replace(/\_(\w)/g, function (all, letter) {
    return letter.toUpperCase()
  })
}

/**
 * 驼峰转换下划线
 */
export function toUnderScoreCase(name) {
  return name.replace(/([A-Z])/g, '_$1').toLowerCase()
}

/**
 * 通过.间隔字符串或者方法获取对象值
 */
export function getRowValueByKey(row, rowKey) {
  if (!row) return false
  if (typeof rowKey === 'string') {
    if (rowKey.indexOf('.') < 0) {
      return row[rowKey]
    }
    const key = rowKey.split('.')
    let current = row
    for (let i = 0; i < key.length; i++) {
      current = current[key[i]]
      if (current === undefined) {
        return false
      }
    }
    return current
  } else if (typeof rowKey === 'function') {
    // eslint-disable-next-line no-useless-call
    return rowKey.call(null, row)
  }
}

export function getPermissionByKey(rowKey) {
  const userStore = useUserStore()
  return !!getRowValueByKey(userStore, rowKey)
}

/**
 * 浏览器打印指定区域的内容
 * @desc 打印区域需要用一个标签包裹起来
 * @param {String} id 要打印的区域元素ID
 */
export function printHTML(id) {
  const contentEl = document.getElementById(id)
  if (!contentEl) return
  let iframe = document.getElementById('print-hook')
  if (iframe) {
    iframe.parentNode.removeChild(iframe)
  }
  iframe = document.createElement('iframe')
  iframe.src = ''
  iframe.id = 'print-hook'
  iframe.width = '0'
  iframe.height = '0'
  document.body.appendChild(iframe)
  iframe.contentWindow.document.body.innerHTML = contentEl.innerHTML
  iframe.contentWindow.print()
}

/**
 * 获取cookies domain
 */
export function getCookiesDomain() {
  const host = window.location.hostname || ''
  const hosts = host.split('.')
  if (hosts.length > 1) {
    hosts.shift()
    return '.' + hosts.join('.')
  }
  return ''
}

/**
 * 元素可见
 */
export function isEleVisible(ele) {
  const { top, right, bottom, left } = ele.getBoundingClientRect()
  const w = window.innerWidth
  const h = window.innerHeight
  if (bottom < 0 || top > h) {
    // y 轴方向
    return false
  }
  if (right < 0 || left > w) {
    // x 轴方向
    return false
  }
  return true
}

/**
 * 获取对应名称的父组件
 * @param {*} componentName
 */
export function getParentComponent(componentName) {
  let parent = this.$parent || this.$root
  let name = parent.$options.componentName

  while (parent && (!name || name !== componentName)) {
    parent = parent.$parent

    if (parent) {
      name = parent.$options.componentName
    }
  }
  return parent
}

/**
 * 颜色增加透明度
 */
export function convertHexByOpacity(hexCode, opacity) {
  let hex = hexCode.replace('#', '')

  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
  }

  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  return 'rgba(' + r + ',' + g + ',' + b + ',' + opacity + ')'
}

/**
 * @description: 跨域请求
 * @param {*} url
 * @param {*} params
 * @param {*} cb
 * @return {*}
 */
export function jsonp({ url, params, cb }) {
  params = { ...params, cb }

  const paramsStringify = Object.keys(params)
    .map((item) => `${item}=${params[item]}`)
    .join('&')

  return new Promise((resolve, reject) => {
    const element = document.createElement('script')
    element.setAttribute('src', `${url}?${paramsStringify}`)
    document.getElementsByTagName('head')[0].appendChild(element)
    if (cb) {
      window[cb] = (res) => {
        resolve(res)
      }
    }
  })
}

/**
 * 从cookie里获取token
 * @returns
 */
export function getTokenByCookie() {
  let token = ''
  const cookieInfo = document.cookie.split(';')
  // eslint-disable-next-line
  for (const item of cookieInfo) {
    const [key, value] = item.trim().split('=')
    if (key === 'token') {
      token = value
      break
    }
  }

  return token
}
