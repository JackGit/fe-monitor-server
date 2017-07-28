const Database = require('../db')
const utils = require('../utils/service')
const setBasicInfoToObject = utils.setBasicInfoToObject
const getIdOfGroupByTimeInterval = utils.getIdOfGroupByTimeInterval

exports.create = async function (basicInfo, trace) {
  const exceptionCollection = Database.collection('Exception')
  const exceptionDocument = {
    name: trace.name,
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
  // TODO: 这里有一些参数默认值和一些验证，比如limit需要为正确范围内的整数等等
  // 这些逻辑应该放在service外层是做，service应该直接接受正确数据
  // 那么上一层，router，在pass到service之前，应该对接口参数进行校验和转换，有问题直接范围“参数不正确”的response
  const exceptionCollection = Database.collection('Exception')
  const sort = condition.sort ? {
    [condition.sort]: condition.ascending ? -1 : 1
  } : null
  const query = {}

  if (condition.from && condition.end) {
    query.createdAt = { $gte: condition.from, $lt: condition.end }
  }

  if (condition.name) {
    query.name = condition.name
  }

  return exceptionCollection.find(query).skip(condition.skip).limit(condition.limit).sort(sort).toArray()
}

exports.getTypeStatistic = async function (condition) {
  const exceptionCollection = Database.collection('Exception')
  const $match = { createdAt: { $exists: 1, $gte: condition.from, $lt: condition.end }}
  const $group = { _id: '$name', count: { $sum: 1 }}
  return exceptionCollection.aggregate([{ $match }, { $group }]).toArray()
}

exports.getFrequencyStatistic = async function (condition) {
  const exceptionCollection = Database.collection('Exception')
  const $match = { createdAt: { $exists: 1, $gte: condition.from, $lt: condition.end }}
  const $group = {
    _id: getIdOfGroupByTimeInterval('createdAt', condition.interval),
    count: { $sum: 1 }
  }

  if (condition.name) {
    $match.name = condition.name
  }

  return exceptionCollection.aggregate([{ $match }, { $group }]).toArray()
}
