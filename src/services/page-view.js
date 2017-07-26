const AV = require('leancloud-storage')
const PageView = AV.Object.extend('PageView')
const setBasicInfoToAVObject = require('../utils/service').setBasicInfoToAVObject

exports.create = async function (basicInfo, trace) {
  const pv = new PageView()

  setBasicInfoToAVObject(pv, basicInfo)
  pv.set('navigationTiming', trace.timing ? trace.timing.navigation : [])
  pv.set('resourceTiming', trace.timing ? trace.timing.resource : [])

  return pv.save()
}

exports.getList = async function (condition) {
  const query = new AV.Query('PageView')

  query.greaterThanOrEqualTo('createdAt', new Date(condition.from))
  query.lessThan('createdAt', new Date(condition.end))

  if (condition.pageUrl) {
    query.equalTo('pageUrl', decodeURIComponent(condition.pageUrl))
  }

  query.descending('createdAt')
  query.limit(condition.limit)

  return query.find()
}

exports.get = async function (id) {
  const query = new AV.Query('PageView')
  return query.get(id)
}
