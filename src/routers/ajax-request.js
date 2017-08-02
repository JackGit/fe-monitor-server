const router = require('koa-router')()
const ajaxRequestService = require('../services/ajax-request')

/**
 * get list data by query parameters
 * query parameters:
 * @param {Array} distinctFields optional
 * @param {Array} fields optional
 * @param {String} sort optional
 * @param {Boolean} ascending optional
 */
router.get('/', async (ctx, next) => {
  const { distinctFields, fields, sort = 'url', ascending = true } = ctx.query
  const response = await ajaxRequestService.getList({
    distinctFields: distinctFields ? distinctFields.split(',') : [],
    fields: fields ? fields.split(',') : [],
    sort,
    ascending: !!ascending
  })
  ctx.body = response
})

module.exports = router
