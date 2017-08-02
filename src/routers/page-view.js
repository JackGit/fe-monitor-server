const router = require('koa-router')()
const pageViewService = require('../services/page-view')

/**
 * query list data of page-view
 * 获取所有pageUrl（distinct）: ?distinctFields=pageUrl&fields=pageUrl&sort=pageUrl&ascending=false
 * @type {[type]}
 */
router.get('/', async (ctx, next) => {
  const { distinctFields, fields, sort = 'createdAt', ascending = true } = ctx.query
  const result = await pageViewService.getList({
    distinctFields: distinctFields ? distinctFields.split(',') : [],
    fields: fields ? fields.split(',') : [],
    sort,
    ascending: !!ascending
  })
  ctx.body = result
})

module.exports = router
