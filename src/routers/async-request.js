const router = require('koa-router')()
const asyncRequestService = require('../services/async-request')

/**
 * query async request list
 * query parameters: pageSize, pageStartIndex, from, to
 */
router.get('/', async (ctx, next) => {
  const asyncRequests = await asyncRequestService.getList({
    from: +ctx.query.from,
    end: +ctx.query.end,
    pageUrl: ctx.query.pageUrl || null,
    url: ctx.query.url || null,
    method: ctx.query.method || null,
    limit: ctx.query.limit || 1000
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
