const router = require('koa-router')()
const projectService = require('../services/project')
const uniqueVistorService = require('../services/unique-visitor')

/**
 * create project
 */
router.post('/', async (ctx, next) => {
  const { name, url, desc } = ctx.request.body
  const response = await projectService.create({ name, url, desc })
  ctx.body = response
})

/**
 * get project list
 */
router.get('/', async (ctx, next) => {
  const { sort = 'createdAt', ascending = true } = ctx.query
  const response = await projectService.getList({ sort, ascending: !!ascending })
  ctx.body = response
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
