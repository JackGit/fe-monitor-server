const AV = require('leancloud-storage')
const UniqueVisitor = AV.Object.extend('UniqueVisitor')
const setBasicInfoToAVObject = require('../utils/service').setBasicInfoToAVObject

exports.create = async function (basicInfo, trace) {
  const uv = new UniqueVisitor()
  setBasicInfoToAVObject(uv, basicInfo)

  return uv.save()
}
