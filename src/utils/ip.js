const ipQuery = require('lib-qqwry').init().speed()
const random = require('lodash.random')

exports.fakeIP = function () {
  return [random(1, 254), random(1, 254), random(1, 254), random(1, 254)].join('.')
}

exports.getIPInfo = function (ip) {
  if (!ip) {
    return {
      province: '',
      networkOperator: ''
    }
  } else {
    const result = ipQuery.searchIP(ip)
    return {
      province: getProvinceShortName(result.Country.trim()),
      networkOperator: getNetworkOperator(result.Area.trim())
    }
  }
}

function getProvinceShortName (value) {
  const spec = ['北京', '天津', '上海', '重庆', '内蒙', '广西', '西藏', '宁夏', '新疆', '香港', '澳门']
  const name = spec.filter(n => value.indexOf(n) !== -1)[0]
  const index = value.indexOf('省')

  if (name) {
    return name
  } else if (index !== -1) {
    return value.substring(0, index)
  } else {
    console.warn('未知省份', value)
    return '其他'
  }
}

function getNetworkOperator (value) {
  // TODO：电信，网通，移动，联通，长城，其他
  return value
}
