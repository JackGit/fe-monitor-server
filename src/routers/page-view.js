const router = require('koa-router')()
const pageViewService = require('../services/page-view')

router.get('/', async (ctx, next) => {
  const result = await pageViewService.getList({
    from: +ctx.query.from,
    end: +ctx.query.end,
    pageUrl: ctx.query.pageUrl,
    limit: ctx.query.limit || 1000
  })
  ctx.body = result
})

module.exports = router
