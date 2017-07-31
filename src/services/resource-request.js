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

exports.getList = async function (condition) {
  const resourceRequestCollection = Database.collection('ResourceRequest')
  let $match = {}
  let $group = null
  let $project = null
  let $sort = null

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

  // other match fields
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
