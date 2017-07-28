const router = require('koa-router')()
const traceRouter = require('./trace')
const projectRouter = require('./project')
const exceptionRouter = require('./exception')
const pageViewRouter = require('./page-view')
const uniqueVisitorRouter = require('./unique-visitor')
const ajaxRequestRouter = require('./ajax-request')

router.use('/trace', traceRouter.routes())
router.use('/project', projectRouter.routes())
router.use('/exceptions', exceptionRouter.routes())
router.use('/page-view', pageViewRouter.routes())
router.use('/unique-visitor', uniqueVisitorRouter.routes())
router.use('/ajax-request', ajaxRequestRouter.routes())

module.exports = router
