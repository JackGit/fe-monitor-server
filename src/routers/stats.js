const router = require('koa-router')()
const ajaxRequestService = require('../services/ajax-request')
const resourceService = require('../services/resource-request')
const exceptionService = require('../services/exception')
const pageViewService = require('../services/page-view')
const uvService = require('../services/unique-visitor')

/**
 * 获得某种（url+method）ajax-request的统计信息，需要指定时间端和时间间隔
 * 返回结构如下：
 * {
 *  "statusInfo":[{"status":200,"count":7}],
 *  "frequencyInfo":[
 *    {"startTime":1501560960000,"count":2,"avgDuration":140.5},
 *    {"startTime":1501560955000,"count":2,"avgDuration":204.5},
 *    {"startTime":1501560950000,"count":1,"avgDuration":658}
 *  ]
 * }
 *
 * @param {String} url required
 * @param {String} method required
 * @param {Number} from required
 * @param {Number} end required
 * @param {Number} interval required
 */
router.get('/ajax-request', async (ctx, next) => {
  const { url, method, from, end, interval } = ctx.query
  const response = await ajaxRequestService.stats({
    url,
    method: method.toUpperCase(),
    from: new Date(+from),
    end: new Date(+end),
    interval: +interval
  })

  ctx.body = response
})

/**
 * 获得指定时段或者所有时段内，exception的类型统计数据：每种类型的出现次数
 * 返回结构如下：
 * [{"type":"Error","count":10},{"type":"PromiseError","count":10},{"type":"ReferenceError","count":10},{"type":"SyntaxError","count":10}]
 *
 * @param {Number} from optional
 * @param {Number} end optional
 */
router.get('/exception/types', async (ctx, next) => {
  const { from, end } = ctx.query
  const response = await exceptionService.statsTypes({
    from: new Date(+from),
    end: new Date(+end)
  })
  ctx.body = response
})

/**
 * 获得某种类型或者所有类型的exception在某个时间段内某个时间间隔的发生次数统计数据
 * 返回结构如下：
 * [{"startTime":1501555200000,"count":1},{"startTime":1501553665000,"count":1}]
 *
 * @param {String} type optional
 * @param {Number} from required
 * @param {Number} end required
 * @param {Number} interval required
 */
router.get('/exception/frequency', async (ctx, next) => {
  const { type, from, end, interval } = ctx.query
  const response = await exceptionService.statsFrequency({
    type,
    from: new Date(+from),
    end: new Date(+end),
    interval: +interval
  })
  ctx.body = response
})

/**
 * 请求某个时间段内某种资源（url+type）的统计数据（频率和平均加载时间）
 *
 * @param {String} url required
 * @param {String} method required
 * @param {Number} from required
 * @param {Number} end required
 * @param {Number} interval required
 */
router.get('/resource', async (ctx, next) => {
  const { url, type, from, end, interval } = ctx.query
  const response = await resourceService.stats({
    url,
    type,
    from: new Date(+from),
    end: new Date(+end),
    interval: +interval
  })
  ctx.body = response
})

router.get('/page/timing', async (ctx, next) => {
  const { pageUrl, from, end, interval } = ctx.query
  const response = await pageViewService.statsTiming({
    pageUrl,
    from: new Date(+from),
    end: new Date(+end),
    interval: +interval
  })
  ctx.body = response
})

router.get('/page/pv', async (ctx, next) => {
  const { pageUrl, from, end, interval } = ctx.query
  const response = await pageViewService.statsPV({
    pageUrl,
    from: new Date(+from),
    end: new Date(+end),
    interval: +interval
  })
  ctx.body = response
})

router.get('/site/pv', async (ctx, next) => {
  const { from, end, interval } = ctx.query
  const response = await pageViewService.statsPV({
    from: new Date(+from),
    end: new Date(+end),
    interval: +interval
  })
  ctx.body = response
})

router.get('/site/uv', async (ctx, next) => {
  const { from, end, interval } = ctx.query
  const response = await uvService.statsUV({
    from: new Date(+from),
    end: new Date(+end),
    interval: +interval
  })
  ctx.body = response
})

router.get('/site/browsers', async (ctx, next) => {
  const { from, end } = ctx.query
  const response = await uvService.statsBrowser({
    from: new Date(+from),
    end: new Date(+end)
  })
  ctx.body = response
})

router.get('/site/os', async (ctx, next) => {
  const { from, end } = ctx.query
  const response = await uvService.statsOS({
    from: new Date(+from),
    end: new Date(+end)
  })
  ctx.body = response
})

router.get('/site/network-operators', async (ctx, next) => {
  const { from, end } = ctx.query
  const response = await uvService.statsNetworkOperator({
    from: new Date(+from),
    end: new Date(+end)
  })
  ctx.body = response
})

router.get('/site/locations', async (ctx, next) => {
  const { from, end } = ctx.query
  const response = await uvService.statsLocation({
    from: new Date(+from),
    end: new Date(+end)
  })
  ctx.body = response
})

module.exports = router
