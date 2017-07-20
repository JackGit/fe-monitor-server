const router = require('koa-router')()
const traceRouter = require('./trace')
const exceptionRouter = require('./exception')
const pageViewRouter = require('./page-view')
const uniqueVisitorRouter = require('./unique-visitor')
const asyncRequestRouter = require('./async-request')

router.use('/trace', traceRouter.routes())
router.use('/exceptions', exceptionRouter.routes())
router.use('/page-view', pageViewRouter.routes())
router.use('/unique-visitor', uniqueVisitorRouter.routes())
router.use('/async-request', asyncRequestRouter.routes())

module.exports = router
