const Database = require('../db')
const utils = require('../utils/service')
const setBasicInfoToObject = utils.setBasicInfoToObject
const getIdOfGroupByTimeInterval = utils.getIdOfGroupByTimeInterval
const fillTimeIntervalGaps = utils.fillTimeIntervalGaps

exports.create = async function (basicInfo, trace) {
  const exceptionCollection = Database.collection('Exception')
  const exceptionDocument = {
    type: trace.name,
    message: trace.message,
    stack: trace.stack || []
  }

  setBasicInfoToObject(exceptionDocument, basicInfo)
  return exceptionCollection.insertOne(exceptionDocument)
}

exports.get = async function (id) {
  const exceptionCollection = Database.collection('Exception')
  return exceptionCollection.findOne({_id: Database.utils.ObjectId(id)})
}

exports.getList = async function (condition) {
  const exceptionCollection = Database.collection('Exception')
  const sort = condition.sort ? {
    [condition.sort]: condition.ascending ? -1 : 1
  } : null
  const query = {}

  if (condition.from && condition.end) {
    query.createdAt = { $gte: condition.from, $lt: condition.end }
  }

  if (condition.type) {
    query.type = condition.type
  }

  return exceptionCollection.find(query).skip(condition.skip).limit(condition.limit).sort(sort).toArray()
}

exports.statsTypes = async function ({ from, end }) {
  const exceptionCollection = Database.collection('Exception')
  const $match = { createdAt: { $gte: from, $lt: end }}
  const $group = { _id: '$type', count: { $sum: 1 }}
  const result = await exceptionCollection.aggregate([{ $match }, { $group }]).toArray()
  return result.map(({ _id, count }) => ({
    type: _id,
    count
  }))
}

exports.statsFrequency = async function ({ type, from, end, interval }) {
  const exceptionCollection = Database.collection('Exception')
  const $match = {
    createdAt: { $gte: from, $lt: end }
  }
  const $group = {
    _id: getIdOfGroupByTimeInterval('createdAt', interval),
    count: { $sum: 1 }
  }

  if (type) {
    $match.type = type
  }

  const result = await exceptionCollection.aggregate([{ $match }, { $group }]).toArray()
  return fillTimeIntervalGaps(result.map(
    ({ _id, count }) => ({
      startTime: _id,
      count,
    })
  ), from, end, interval)
}
