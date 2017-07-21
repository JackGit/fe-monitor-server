const AV = require('leancloud-storage')
const Exception = AV.Object.extend('Exception')
const setBasicInfoToAVObject = require('../utils/service').setBasicInfoToAVObject

exports.create = async function (basicInfo, trace) {
  const exception = new Exception()

  setBasicInfoToAVObject(exception, basicInfo)
  exception.set('name', trace.name)
  exception.set('message', trace.message)
  exception.set('stack', trace.stack || [])

  return exception.save()
}

exports.getList = async function (condition) {
  const query = new AV.Query('Exception')
  query.greaterThanOrEqualTo('createdAt', new Date(condition.from))
  query.lessThan('createdAt', new Date(condition.end))
  query.decending('createdAt')
  query.limit(1000)
  return query.find()
}

exports.get = async function (id) {
  const query = new AV.Query('Exception')
  return query.get(id)
}
