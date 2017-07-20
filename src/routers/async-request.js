const router = require('koa-router')()
const asyncRequestService = require('../services/async-request')

/**
 * query async request list
 * query parameters: pageSize, pageStartIndex, from, to
 */
router.get('/', async (ctx, next) => {
  const asyncRequests = await asyncRequestService.getList({
    from: ctx.query.from * 1,
    end: ctx.query.end * 1
  })
  ctx.body = asyncRequests
})

/**
 * get async request details by id
 */
router.get('/:asyncRequestId', async (ctx, next) => {
  const asyncRequest = await asyncRequestService.get(ctx.params.asyncRequestId)
  ctx.body = asyncRequest
})

module.exports = router
