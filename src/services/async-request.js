const AV = require('leancloud-storage')
const AsyncRequest = AV.Object.extend('AsyncRequest')
const setBasicInfoToAVObject = require('../utils/service').setBasicInfoToAVObject

exports.create = async function (basicInfo, trace) {
  const asyncRequest = new AsyncRequest()

  setBasicInfoToAVObject(asyncRequest, basicInfo)
  asyncRequest.set('url', trace.url)
  asyncRequest.set('method', trace.method)
  asyncRequest.set('startAt', new Date(trace.startTiming))
  asyncRequest.set('endAt', new Date(trace.endTiming))
  asyncRequest.set('duration', trace.duration)
  asyncRequest.set('status', trace.status)
  asyncRequest.set('ok', trace.ok)

  return asyncRequest.save()
}
