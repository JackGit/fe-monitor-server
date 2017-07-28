const router = require('koa-router')()
const exceptionService = require('../services/exception')

/**
 * return exception list
 * query parameters:
 * @param {String} name optional
 * @param {Number} from optional
 * @param {Number} end optional
 * @param {Number} limit optional
 * @param {Number} skip optional
 * @param {String} sort optional
 * @param {Boolean} ascending optional
 */
router.get('/', async (ctx, next) => {
  const { name, from, end, skip = 0, limit = 200, sort = 'createdAt', ascending = true } = ctx.query
  const exceptionList = await exceptionService.getList({
    name,
    from: from && new Date(+from),
    end: end && new Date(+end),
    skip: +skip,
    limit: +limit,
    sort,
    ascending: !!ascending
  })
  ctx.body = exceptionList
})

/**
 * query exception details by id
 */
router.get('/:exceptionId', async (ctx, next) => {
  const exception = await exceptionService.get(ctx.params.exceptionId)
  ctx.body = exception
})

/**
 * 获取一段时间范围内的exception类型分布：每个类型的出现次数
 * query parameters:
 * @param {Number} from required
 * @param {Number} end required
 */
router.get('/statistic/type', async (ctx, next) => {
  const { from, end } = ctx.query
  const data = await exceptionService.getTypeStatistic({
    from: new Date(+from),
    end: new Date(+end)
  })
  ctx.body = data
})

/**
 * 获取一段时间内某个时间间隔下exception的发生次数
 * query parameters:
 * @param {Number} from required
 * @param {Number} end required
 * @param {Number} interval required
 * @param {String} name optional
 */
router.get('/statistic/frequency', async (ctx, next) => {
  const { from, end, interval, name } = ctx.query
  const data = await exceptionService.getFrequencyStatistic({
    name,
    from: new Date(+from),
    end: new Date(+end),
    interval: +interval
  })
  ctx.body = data
})

module.exports = router
