const router = require('koa-router')()
const projectService = require('../services/project')
const uniqueVistorService = require('../services/unique-visitor')

/**
 * create project
 */
router.post('/', async (ctx, next) => {

})

/**
 * get project list
 */
router.get('/', async (ctx, next) => {
  
})

/**
 * get project
 */
router.get('/:projectId', async (ctx, next) => {

})

router.get('/statistic/uv', async (ctx, next) => {
  const { from, end, interval } = ctx.query
  const result = await uniqueVistorService.getUVStatistic({
    from: new Date(+from),
    end: new Date(+end),
    interval: +interval,
    type: 'project'
  })
  ctx.body = result
})

module.exports = router
