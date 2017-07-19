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
