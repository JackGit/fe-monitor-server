const router = require('koa-router')()
const pvService = require('../services/page-view')
const uvService = require('../services/unique-visitor')
const exceptionService = require('../services/exception')
const asyncRequestService = require('../services/async-request')
const extendBasicInfo = require('../utils/service').extendBasicInfo

router.post('/', async (ctx, next) => {
  let response
  const ip = ctx.headers['x-real-ip']
  const request = ctx.request.body
  const basic = request.basic
  const traces = request.traces

  basic.ip = ip
  const basicInfo = extendBasicInfo(basic)

  try {
    // create DB record for each trace in parallel
    await Promise.all(traces.map(async (trace) => {
      switch (trace.type) {
        case 'exception':
          response = await exceptionService.create(basicInfo, trace)
          break;
        case 'ajax':
        case 'fetch':
          response = await asyncRequestService.create(basicInfo, trace)
          break;
        case 'pv':
          response = await pvService.create(basicInfo, trace)
          break;
        case 'uv':
          response = await uvService.create(basicInfo, trace)
          break;
        default:
          response = ''
      }
      console.log('trace create response', response)
    }))

    ctx.body = ''
  } catch (e) {
    ctx.body = ''
    ctx.status = ''
  }
})

module.exports = router
