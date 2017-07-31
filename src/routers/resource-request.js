const router = require('koa-router')()
const routerRequestService = require('../services/router-request')

/**
 * 获取所有的（distinct）资源数据（url+type）
 * 可以通过pageUrl，type过滤
 * 'xx:4141/resource-request?distinctFields=url,type&fields=url,type&sort='
 * @param {String} pageUrl optional
 * @param {String} type optional
 * @param {String} sort optional
 * @param {Boolean} ascending optional
 * @param {Array} distinctFields optional
 * @param {Array} fields optional
 * @param {Number} skip optional
 * @param {Number} limit optional
 * @param {Number} pageSize optional
 * @param {Number} pageIndex optional
 */
router.get('/urltypes', async (ctx, next) => {
  const { pageUrl, type, sort = 'url', ascending = false } = ctx.query
  const response = await routerRequestService.getDistinct({
    pageUrl,
    type,
    sort,
    ascending: !!ascending
  })
  ctx.body = response
})

/**
 * 请求某个时间段内某种资源（url+type）的统计数据（频率和平均加载时间）
 */
router.get('/statistic', async (ctx, next) => {
  const { url, type, from, end, interval } = ctx.query
  const response = await routerRequestService.getFrequencyStatistic({
    url,
    type,
    from: new Date(+from),
    end: new Date(+end),
    interval: +interval
  })
  ctx.body = response
})

module.exports = router
