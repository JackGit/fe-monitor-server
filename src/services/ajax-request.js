const Database = require('../db')
const utils = require('../utils/service')
const setBasicInfoToObject = utils.setBasicInfoToObject
const getIdOfGroupByTimeInterval = utils.getIdOfGroupByTimeInterval
const commonListQuerySetting = utils.commonListQuerySetting
const getAggregation = utils.getAggregation
const fillTimeIntervalGaps = utils.fillTimeIntervalGaps

exports.create = async function (basicInfo, trace) {
  const ajaxRequestCollection = Database.collection('AjaxRequest')
  const ajaxRequestDocument = {
    url: trace.url,
    method: trace.method,
    startAt: new Date(trace.startTiming),
    endAt: new Date(trace.endTiming),
    duration: trace.duration,
    status: trace.status
  }
  setBasicInfoToObject(ajaxRequestDocument, basicInfo)
  return ajaxRequestCollection.insertOne(ajaxRequestDocument)
}

exports.getList = async function (condition) {
  const ajaxRequestCollection = Database.collection('AjaxRequest')
  const listQuerySettings = commonListQuerySetting(condition)
  const aggregation = getAggregation(listQuerySettings)
  const $match = { projectId: condition.projectId }

  aggregation.unshift({ $match })
  return ajaxRequestCollection.aggregate(aggregation).toArray()
}

exports.stats = async function (condition) {
  const result = await Promise.all([getStatusStatistic(condition), getFrequencyStatistic(condition)])
  return {
    statusInfo: result[0],
    frequencyInfo: result[1]
  }
}

async function getStatusStatistic ({ projectId, url, method, from, end }) {
  const ajaxRequestCollection = Database.collection('AjaxRequest')
  const $match = {
    projectId,
    url,
    method,
    startAt: { $gte: from, $lt: end }
  }
  const $group = { _id: '$status', count: { $sum: 1 }}
  const result = await ajaxRequestCollection.aggregate([{ $match }, { $group }]).toArray()

  return result.map(({ _id, count }) => ({
    status: _id,
    count
  }))
}

async function getFrequencyStatistic ({ projectId, url, method, from, end, interval }) {
  const ajaxRequestCollection = Database.collection('AjaxRequest')
  const $match = {
    projectId,
    url,
    method,
    startAt: { $gte: from, $lt: end }
  }
  const $group = {
    _id: getIdOfGroupByTimeInterval('startAt', interval),
    count: { $sum: 1 }, // 发生频率（次数）
    avgDuration: { $avg: '$duration' } // 平均响应时间
  }
  const result = await ajaxRequestCollection.aggregate([{ $match }, { $group }]).toArray()

  return fillTimeIntervalGaps(
    result.map(({ _id, count, avgDuration }) => ({
      startTime: _id,
      count,
      avgDuration
    })),
    from,
    end,
    interval
  )
}
