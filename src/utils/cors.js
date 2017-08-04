const URL = require('url-parse')
let ALLOW_CROSS_ORIGIN_DOMAINS = ['localhost:8080']

exports.addDomain = function (url) {
  const domain = new URL(url).host
  ALLOW_CROSS_ORIGIN_DOMAINS.push(domain)
}

exports.removeDomain = function (url) {
  const domain = new URL(url).host
  ALLOW_CROSS_ORIGIN_DOMAINS = ALLOW_CROSS_ORIGIN_DOMAINS.filter(item => item !== domain)
}

exports.corsDomains = function () {
  return ALLOW_CROSS_ORIGIN_DOMAINS
}
