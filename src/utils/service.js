const uaParser = require('ua-parser-js')
const ipQuery = require('lib-qqwry').init().speed()
const random = require('lodash.random')

exports.commonListQuerySetting = function ({ distinctFields, fields, sort, ascending }) {
  let $group
  let $project
  let $sort

  // set distinct fields
  if (condition.distinctFields.length > 0) {
    $group = { _id: {}}
    condition.distinctFields.forEach(field => {
      $group._id[field] = `$${field}`
    })
  }

  // set select fields
  if (condition.fields.length > 0) {
    $project = {}
    condition.fields.forEach(field => $project[field] = 1)
  }

  // sort
  if (condition.sort) {
    $sort = { [condition.sort]: condition.ascending ? -1 : 1 }
  }

  return {
    $group,
    $project,
    $sort
  }
}

/**
 * ip, os, browser, platform, page url, full url, network provider, location, rawUserAgent, resolution
 * @param  {Object} avObject  [description]
 * @param  {Object} basicInfo [description]
 */
exports.setBasicInfoToAVObject = function (avObject, basicInfo) {
  ['ip', 'pageUrl', 'fullUrl', 'os', 'browser', 'device', 'resolution', 'province', 'networkOperator', 'userAgent']
  .forEach(key => avObject.set(key, basicInfo[key]))
}

exports.setBasicInfoToObject = function (obj, basicInfo) {
  ['projectId', 'ip', 'pageUrl', 'fullUrl', 'os', 'browser', 'device', 'resolution', 'province', 'networkOperator', 'userAgent']
  .forEach(key => obj[key] = basicInfo[key])
  obj.createdAt = new Date()
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
    networkOperator: ipInfo.networkOperator,
    userAgent: data.userAgent
  }
}


const VERY_START_DATE = new Date('1970-01-01')
/**
 * return object would be used in:
 * {
 *   $group: { _id: result }
 * }
 * @param  {String} field    field name (without $)
 * @param  {Number} interval millisecond
 * @return {Object}
 */
exports.getIdOfGroupByTimeInterval = function (field, interval) {
  return {
    $subtract: [
      { $subtract: [ `$${field}`,  VERY_START_DATE ]},
      { $mod: [{ $subtract: [ `$${field}`, VERY_START_DATE ]}, interval ]}
    ]
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
