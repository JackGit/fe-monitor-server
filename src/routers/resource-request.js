const router = require('koa-router')()
const resourceRequestService = require('../services/resource-request')

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
router.get('/', async (ctx, next) => {
  const { distinctFields, fields, sort = 'url', ascending = false } = ctx.query
  const response = await resourceRequestService.getList({
    distinctFields: distinctFields ? distinctFields.split(',') : [],
    fields: fields ? fields.split(',') : [],
    sort,
    ascending: !!ascending
  })
  ctx.body = response
})

module.exports = router
