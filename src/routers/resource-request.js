const router = require('koa-router')()
const routerRequestService = require('../services/router-request')

/**
 * 获取所有的（distinct）资源数据（url+type）
 * 可以通过pageUrl，type过滤
 */
router.get('/distinct', async (ctx, next) => {
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
