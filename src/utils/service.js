const uaParser = require('ua-parser-js')
const ipQuery = require('lib-qqwry').init().speed()
const random = require('lodash.random')

/**
 * ip, os, browser, platform, page url, full url, network provider, location, rawUserAgent, resolution
 * @param  {Object} avObject  [description]
 * @param  {Object} basicInfo [description]
 */
exports.setBasicInfoToAVObject = function (avObject, basicInfo) {
  ['ip', 'pageUrl', 'fullUrl', 'os', 'browser', 'device', 'resolution', 'province', 'networkOperator']
  .forEach(key => avObject.set(key, basicInfo[key]))
}

exports.extendBasicInfo = function (data) {
  const uaInfo = uaParser(data.userAgent)
  const ipInfo = getIPInfo(data.ip)

  return {
    ip: data.ip,
    pageUrl: data.pageUrl,
    fullUrl: data.fullUrl,
    os: uaInfo.os,
    browser: uaInfo.browser,
    device: uaInfo.device,
    resolution: data.resolution,
    province: ipInfo.province,
    networkOperator: ipInfo.networkOperator
  }
}

exports.fakeIP = function () {
  return [random(1, 254), random(1, 254), random(1, 254), random(1, 254)].join('.')
}

function getIPInfo (ip) {
  if (!ip) {
    return {
      province: '',
      networkOperator: ''
    }
  } else {
    const result = ipQuery.searchIP(ip)
    return {
      province: getProvinceShortName(result.Country.trim()),
      networkOperator: getNetworkOperator(result.Area.trim())
    }
  }
}


function getProvinceShortName (value) {
  const spec = ['北京', '天津', '上海', '重庆', '内蒙', '广西', '西藏', '宁夏', '新疆', '香港', '澳门']
  const name = spec.filter(n => value.indexOf(n) !== -1)[0]
  const index = value.indexOf('省')

  if (name) {
    return name
  } if (index !== -1) {
    return value.substring(0, index)
  } else {
    console.warn('未知省份', value)
    return '其他'
  }
}

function getNetworkOperator (value) {
  // TODO：电信，网通，移动，联通，长城，其他
  return value
}
