const Database = require('../db')
const utils = require('../utils/service')
const setBasicInfoToObject = utils.setBasicInfoToObject
const commonListQuerySetting = utils.commonListQuerySetting
const getIdOfGroupByTimeInterval = utils.getIdOfGroupByTimeInterval
const fillTimeIntervalGaps = utils.fillTimeIntervalGaps
const getAggregation = utils.getAggregation

exports.create = async function (basicInfo, trace) {
  const pvCollection = Database.collection('PageView')
  const pvDocument = {
    timing: trace.timing || []
  }

  setBasicInfoToObject(pvDocument, basicInfo)
  return pvCollection.insertOne(pvDocument)
}

exports.getList = async function (condition) {
  const pvCollection = Database.collection('PageView')
  const listQuerySettings = commonListQuerySetting(condition)
  const aggregation = getAggregation(listQuerySettings)

  return pvCollection.aggregate(aggregation).toArray()
}

exports.statsPV = async function ({ pageUrl, from, end, interval }) {
  const pvCollection = Database.collection('PageView')
  const $match = { createdAt: { $gte: from, $lt: end }}
  const $group = {
    _id: getIdOfGroupByTimeInterval('createdAt', interval),
    count: { $sum: 1 }
  }

  // if there is no pageUrl, mean get PV for whole site
  if (pageUrl) {
    $match.pageUrl = pageUrl
  }

  const result = await pvCollection.aggregate([{ $match }, { $group }]).toArray()

  return fillTimeIntervalGaps(result.map(
    ({ _id, count }) => ({
      startTime: _id,
      count,
    })
  ), from, end, interval)
}

exports.statsTiming = async function ({ pageUrl, from, end, interval }) {
  const pvCollection = Database.collection('PageView')
  const $match = {
    pageUrl,
    createdAt: { $gte: from, $lt: end }
  }
  const $group = {
    _id: getIdOfGroupByTimeInterval('createdAt', interval),
    dns: { $avg: { $arrayElemAt: [ '$timing.duration', 0 ]}},
    tcp: { $avg: { $arrayElemAt: [ '$timing.duration', 1 ]}},
    whiteScreen: { $avg: { $arrayElemAt: [ '$timing.duration', 6 ]}},
    firstScreen: { $avg: { $arrayElemAt: [ '$timing.duration', 7 ]}},
    total: { $avg: { $arrayElemAt: [ '$timing.duration', 9 ]}}
  }
  const result = await pvCollection.aggregate([
    { $match },
    { $group }
  ]).toArray()

  return fillTimeIntervalGaps(result.map(
    ({ _id, dns, tcp, whiteScreen, firstScreen, total }) => ({
      startTime: _id,
      dns,
      tcp,
      whiteScreen,
      firstScreen,
      total
    })
  ), from, end, interval)
}
