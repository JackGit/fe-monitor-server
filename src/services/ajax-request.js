const Database = require('../db')
const utils = require('../utils/service')
const setBasicInfoToObject = utils.setBasicInfoToObject
const getIdOfGroupByTimeInterval = utils.getIdOfGroupByTimeInterval

exports.create = async function (basicInfo, trace) {
  const ajaxRequestCollection = Database.collection('AjaxRequest')
  const ajaxRequestDocument = {
    url: decodeURIComponent(race.url),
    method: trace.method,
    startAt: new Date(trace.startTiming),
    endAt: new Date(trace.endTiming),
    duration: trace.duration,
    status: trace.status
  }
  setBasicInfoToObject(ajaxRequestDocument)
  return ajaxRequestCollection.insertOne(ajaxRequestDocument)
}

exports.getDistinct = async function (condition) {
  const ajaxRequestCollection = Database.collection('AjaxRequest')
  const $project = { method: 1, url: 1 }
  const $group = { _id: { method: '$method', url: '$url' }}
  const $match = {} // TODO projectId
  const $sort = condition.sort ? {
    [condition.sort]: condition.ascending ? -1 : 1
  } : null

  if (condition.pageUrl) {
    $match.pageUrl = decodeURIComponent(condition.pageUrl)
  }
  if (condition.method) {
    $match.method = method
  }

  return ajaxRequestCollection.aggregate([
    { $match },
    { $group },
    { $project },
    { $sort }
  ]).toArray()
}

exports.getStatusStatistic = async function (condition) {
  const ajaxRequestCollection = Database.collection('AjaxRequest')
  // 匹配某个时间端的状态码次数
  const $match = { startAt: { $gte: condition.from, $lt: condition.end }}
  const $group = { _id: '$status', count: { $sum: 1 }}

  // 可以通过pageUrl, method, url进行过滤
  if (condition.pageUrl) {
    $match.pageUrl = decodeURIComponent(condition.pageUrl)
  }
  if (condition.method) {
    $match.method = condition.method
  }
  if (condition.url) {
    $match.url = decodeURIComponent(condition.url)
  }

  return ajaxRequestCollection.aggregate([{ $match }, { $group }]).toArray()
}

exports.getFrequencyStatistic = async function (condition) {
  const ajaxRequestCollection = Database.collection('AjaxRequest')

  // 匹配某个时间段内的，一种类型请求（method+url）的统计数据
  const $match = {
    method: condition.method,
    url: decodeURIComponent(condition.url),
    startAt: { $gte: condition.from, $lt: condition.end }
  }
  const $group = {
    _id: getIdOfGroupByTimeInterval('startAt', condition.interval),
    count: { $sum: 1 }, // 发生频率（次数）
    avgDuration: { $avg: '$duration' } // 平均响应时间
  }

  return ajaxRequestCollection.aggregate([{ $match }, { $group }]).toArray()
}
