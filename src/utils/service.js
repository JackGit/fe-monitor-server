const uaParser = require('ua-parser-js')
const getIPInfo = require('./ip').getIPInfo

exports.commonListQuerySetting = function ({ distinctFields = [], fields = [], limit, sort, ascending }) {
  let $group
  let $project
  let $sort
  let $limit

  // set distinct fields
  if (distinctFields.length > 0) {
    $group = { _id: {}}
    distinctFields.forEach(field => {
      $group._id[field] = `$${field}`
      $group[field] = { $first: `$${field}` }
    })
  }

  // set select fields
  if (fields.length > 0) {
    $project = {}
    fields.forEach(field => $project[field] = 1)
  }

  // sort
  if (sort) {
    $sort = { [sort]: ascending ? -1 : 1 }
  }

  // limit
  if (limit) {
    $limit = limit
  }

  return {
    $group,
    $project,
    $sort,
    $limit
  }
}

exports.getAggregation = function (settings) {
  const aggregation = []
  Object.keys(settings)
    .filter(key => settings[key])
    .forEach(key => aggregation.push({ [key]: settings[key] }))
  return aggregation
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
    projectId: data.projectId,
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

exports.fillTimeIntervalGaps = function (data, from, end, interval) {
  if (data.length === 0) {
    return []
  }

  const startTime = (from - VERY_START_DATE) - (from - VERY_START_DATE) % interval
  const keys = Object.keys(data[0]).filter(key => key !== 'startTime')
  const arr = []
  const temp = {}
  let time = startTime

  data.forEach(item => {
    temp[item.startTime] = {}
    keys.forEach(key => temp[item.startTime][key] = item[key])
  })

  while (time < end) {
    let item = { startTime: time }
    keys.forEach(key => {
      if (temp[time] && temp[time][key]) {
        item[key] = temp[time][key]
      } else {
        item[key] = 0
      }
    })
    arr.push(item)
    time += interval
  }

  return arr
}
