const router = require('koa-router')()
const exceptionService = require('../services/exception')

/**
 * return exception list
 * query parameters:
 * @param {String} type optional
 * @param {Number} from optional
 * @param {Number} end optional
 * @param {Number} limit optional
 * @param {Number} skip optional
 * @param {String} sort optional
 * @param {Boolean} ascending optional
 */
router.get('/', async (ctx, next) => {
  const { projectId, type, from, end, skip = 0, limit = 200, sort = 'createdAt', ascending = true } = ctx.query
  const exceptionList = await exceptionService.getList({
    projectId,
    type,
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

module.exports = router
