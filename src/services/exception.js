const AV = require('leancloud-storage')
const Exception = AV.Object.extend('Exception')
const setBasicInfoToAVObject = require('../utils/service').setBasicInfoToAVObject

exports.create = async function (basicInfo, trace) {
  const exception = new Exception()

  setBasicInfoToAVObject(exception, basicInfo)
  exception.set('name', trace.name)
  exception.set('message', trace.message)
  exception.set('stack', trace.stack)

  return exception.save()
}
