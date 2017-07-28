const Database = require('../db')
const utils = require('../utils/service')
const setBasicInfoToObject = utils.setBasicInfoToObject
const getIdOfGroupByTimeInterval = utils.getIdOfGroupByTimeInterval

exports.create = async function (basicInfo, resourceTiming) {
  const resourceRequestCollection = Database.collection('ResourceRequest')
  const resourceRequestDocument = {
    url: resourceTiming.name,
    type: resourceTiming.name.substring(resourceTiming.name.lastIndexOf('.') + 1),
    size: resourceTiming.size,
    startAt: new Date(resourceTiming.start),
    endAt: new Date(resourceTiming.end),
    duration: resourceTiming.duration
  }

  setBasicInfoToObject(resourceRequestDocument, basicInfo)
  return resourceRequestCollection.insertOne(resourceRequestDocument)
}

exports.getDistinct = async function (condition) {
  const resourceRequestCollection = Database.collection('ResourceRequest')
  const $project = { url: 1 }
  const $group = { _id: '$url' }
  const $match = {} // TODO projectId
  const $sort = condition.sort ? {
    [condition.sort]: condition.ascending ? -1 : 1
  } : null

  if (condition.type) {
    $match.type = type
  }
  if (condition.pageUrl) {
    $match.pageUrl = decodeURIComponent(condition.pageUrl)
  }

  return resourceRequestCollection.aggregate([
    { $match },
    { $group },
    { $project },
    { $sort }
  ]).toArray()
}

exports.getFrequencyStatistic = async function (condition) {
  const resourceRequestCollection = Database.collection('ResourceRequest')
  const $match = {
    url: decodeURIComponent(condition.url),
    type: condition.type,
    startAt: { $gte: condition.from, $lt: condition.end }
  }
  const $group = {
    _id: getIdOfGroupByTimeInterval('startAt', condition.interval),
    count: { $sum: 1 },
    avgDuration: { $avg: '$duration' }
  }

  return resourceRequestCollection.aggregate([{ $match }, { $group }]).toArray()
}
