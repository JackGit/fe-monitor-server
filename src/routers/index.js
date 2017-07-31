const router = require('koa-router')()
const traceRouter = require('./trace')
const projectRouter = require('./project')
const exceptionRouter = require('./exception')
const pageViewRouter = require('./page-view')
const uniqueVisitorRouter = require('./unique-visitor')
const ajaxRequestRouter = require('./ajax-request')
const resourceRequestRouter = require('./resource-request')

router.use('/trace', traceRouter.routes())
router.use('/projects', projectRouter.routes())
router.use('/exceptions', exceptionRouter.routes())
router.use('/page-view', pageViewRouter.routes())
router.use('/unique-visitor', uniqueVisitorRouter.routes())
router.use('/ajax-requests', ajaxRequestRouter.routes())
router.use('/resource-requests', resourceRequestRouter.routes())

module.exports = router
