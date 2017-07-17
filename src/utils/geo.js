export function getProvinceShortName (value) {
  const spec = ['北京', '天津', '上海', '重庆', '内蒙', '广西', '西藏', '宁夏', '新疆', '香港', '澳门']
  const name = spec.filter(n => value.indexOf(n) !== -1)[0]
  const index = value.indexOf('省')

  if (name) {
    return name
  } if (index !== -1) {
    return value.substring(0, index)
  } else {
    console.warn('未知省份', value)
    return '其他'
  }
}
