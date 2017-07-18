const router = require('koa-router')()
const traceRouter = require('./trace')

router.use('/trace', traceRouter.routes())

module.exports = router


/**
 * PageView table
 * [ip, visitAt,
 * os, browser, platform, page url, full url, network provider, location, rawUserAgent, resolution,
 * performance (navigation, resources)]
 * index: visitAt, page url
 *
 * UV table
 * [ip, visitAt,
 * os, browser, platform, page url, network provider, location, rawUserAgent, resolution]
 * index: visitAt, page url
 *
 * Ajax table
 * [request url, request method, startedAt, endedAt, duration, reponse status, failed,
 * ip, os, browser, platform, page url, full url, network provider, location, rawUserAgent, resolution]
 * index: request url + request method, startedAt
 *
 * Exception table
 * [name, message, stack, occuredAt,
 * ip, os, browser, platform, page url, full url, network provider, location, rawUserAgent, resolution]
 * index: occuredAt
 */
