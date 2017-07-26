const router = require('koa-router')()
const exceptionService = require('../services/exception')

/**
 * return exception list
 * query parameters: from, end
 */
router.get('/', async (ctx, next) => {
  const exceptionList = await exceptionService.getList({
    from: ctx.query.from * 1,
    end: ctx.query.end * 1,
    limit: ctx.query.limit || 1000
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

module.exports = router
