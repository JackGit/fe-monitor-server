const Database = require('../db')
const utils = require('../utils/service')
const setBasicInfoToObject = utils.setBasicInfoToObject
const getIdOfGroupByTimeInterval = utils.getIdOfGroupByTimeInterval
const commonListQuerySetting = utils.commonListQuerySetting
const fillTimeIntervalGaps = utils.fillTimeIntervalGaps
const getAggregation = utils.getAggregation

exports.create = async function (basicInfo, trace) {
  if (trace.timing.length === 0) {
    return
  }

  const resourceTiming = trace.timing
  const resourceRequestCollection = Database.collection('ResourceRequest')
  const resourceRequestDocuments = []

  resourceTiming.forEach(item => {
    const doc = {
      url: item.name,
      type: item.name.substring(item.name.lastIndexOf('.') + 1),
      size: item.size,
      duration: item.duration
    }
    setBasicInfoToObject(doc, basicInfo)
    resourceRequestDocuments.push(doc)
  })

  return resourceRequestCollection.insertMany(resourceRequestDocuments)
}

exports.getList = async function (condition) {
  const resourceRequestCollection = Database.collection('ResourceRequest')
  const listQuerySettings = commonListQuerySetting(condition)
  const aggregation = []

  // other match fields
  ;['type', 'pageUrl'].forEach(key => {
    if (condition[key]) {
      listQuerySettings.$match || (listQuerySettings.$match = {})
      listQuerySettings.$match[key] = condition[key]
    }
  })

  aggregation = getAggregation(listQuerySettings)
  return resourceRequestCollection.aggregate(aggregation).toArray()
}

exports.stats = async function ({ url, method, from, end, interval }) {
  const resourceRequestCollection = Database.collection('ResourceRequest')
  const $match = {
    url,
    type,
    startAt: { $gte: from, $lt: end }
  }
  const $group = {
    _id: getIdOfGroupByTimeInterval('startAt', interval),
    count: { $sum: 1 },
    avgDuration: { $avg: '$duration' }
  }

  return fillTimeIntervalGaps(
    resourceRequestCollection.aggregate([{ $match }, { $group }]).toArray(),
    from,
    end,
    interval
  )
}
