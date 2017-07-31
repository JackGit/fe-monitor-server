const router = require('koa-router')()
const ajaxRequestService = require('../services/ajax-request')

/**
 * get distinct data (method, url) by query parameters
 * query parameters:
 * @param {String} pageUrl optional
 * @param {String} method optional
 * @param {String} sort optional
 * @param {Boolean} ascending optional
 */
router.get('/distinct', async (ctx, next) => {
  const { pageUrl, method, sort = 'pageUrl', ascending = true } = ctx.query
  const distinctData = await ajaxRequestService.getDistinct({
    pageUrl,
    method,
    sort,
    ascending: !!ascending
  })
  ctx.body = distinctData
})

/**
 * 获取一段时间范围内的异步请求返回码分布
 * 可以通过method，url，pageUrl过滤
 * query parameters:
 * @param {Number} from required
 * @param {Number} end required
 * @param {String} method optional
 * @param {String} url optional
 * @param {String} pageUrl optional
 */
router.get('/statistic/status', async (ctx, next) => {
  const { method, url, pageUrl, from, end } = ctx.query
  const response = await ajaxRequestService.getFrequencyStatistic({
    method,
    url,
    pageUrl,
    from: new Date(+from),
    end: new Date(+end)
  })
  ctx.body = response
})

/**
 * 获取一段时间内某个时间间隔下某种(method+url)异步请求的发生次数和平均响应时间
 * query parameters:
 * @param {String} method required
 * @param {String} url required
 * @param {Number} from required
 * @param {Number} end required
 * @param {Number} interval required
 * @param {String} name optional
 */
router.get('/statistic/frequency', async (ctx, next) => {
  const { method, url, from, end, interval } = ctx.query
  const response = await ajaxRequestService.getFrequencyStatistic({
    method,
    url,
    from: new Date(+from),
    end: new Date(+end),
    interval: +interval
  })
  ctx.body = response
})

module.exports = router
