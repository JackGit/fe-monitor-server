const router = require('koa-router')()
const traceRouter = require('./trace')

router.use('/trace', traceRouter.routes())

module.exports = router
