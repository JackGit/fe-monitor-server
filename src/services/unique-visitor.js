const Database = require('../db')
const utils = require('../utils/service')
const setBasicInfoToObject = utils.setBasicInfoToObject
const getIdOfGroupByTimeInterval = utils.getIdOfGroupByTimeInterval
const fillTimeIntervalGaps = utils.fillTimeIntervalGaps

exports.create = async function (basicInfo, trace) {
  const uvCollection = Database.collection('UniqueVisitor')
  const uvDocument = {}
  setBasicInfoToObject(uvDocument, basicInfo)
  return uvCollection.insertOne(uvDocument)
}

exports.statsUV = async function ({ projectId, from, end, interval }) {
  const uvCollection = Database.collection('UniqueVisitor')
  const $match = { projectId, createdAt: { $gte: from, $lt: end }}
  const $group = {
    _id: getIdOfGroupByTimeInterval('createdAt', interval),
    count: { $sum: 1 }
  }
  const result = await uvCollection.aggregate([{ $match }, { $group }]).toArray()

  return fillTimeIntervalGaps(result.map(
    ({ _id, count }) => ({ startTime: _id, count })
  ), from, end, interval)
}

exports.statsBrowser = async function ({ projectId, from, end }) {
  return statsOneField('browser', 'browser.name', projectId, from, end)
}

exports.statsOS = async function ({ projectId, from, end }) {
  return statsOneField('os', 'os.name', projectId, from, end)
}

exports.statsNetworkOperator = async function ({ projectId, from, end }) {
  return statsOneField('networkOperator', 'networkOperator', projectId, from, end)
}

exports.statsLocation = async function ({ projectId, from, end }) {
  return statsOneField('province', 'province', projectId, from, end)
}

async function statsOneField (field, groupBy, projectId, from, end) {
  const uvCollection = Database.collection('UniqueVisitor')
  const $match = { projectId, createdAt: { $gte: from, $lt: end }}
  const $group = { _id: `$${groupBy}`, count: { $sum: 1 }}
  const result = await uvCollection.aggregate([{ $match }, { $group }]).toArray()
  return result.map(({ _id, count }) => ({ [field]: _id, count }))
}
