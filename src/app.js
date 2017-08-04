const path = require('path')
const Koa = require('koa')
const serve = require('koa-static')
const koaLogger = require('koa-logger')
const compress = require('koa-compress')
const onerror = require('koa-onerror')
const favicon = require('koa-favicon')
const bodyParser = require('koa-bodyparser')
const cors = require('kcors')
const corsUtils = require('./utils/cors')
const config = require('./config')
const router = require('./routers')
const Database = require('./db')
const projectService = require('./services/project')

const app = new Koa()
const PORT = config.PORT
const DB_URL = config.DB_URL

// error handling
onerror(app)
app.on('error', (err, ctx) => {
  console.error('app error', err)
})

// logger
app.use(koaLogger())

// compress
app.use(compress())

// cros
// app.use(cors())
app.use(cors({
  origin (ctx) {
    let o = ctx.request.headers.origin
    if (corsUtils.corsDomains().filter(domain => o.endsWith(domain)).length > 0) {
      return o
    }
  }
}))

// body parser
app.use(bodyParser())

// routers
app.use(router.routes())

// static serve
app.use(serve(path.resolve(__dirname, './public')))

// connect database and start server
Database.connect(DB_URL, () => {
  console.log('db is connected')
  projectService.cacheDomains()

  app.listen(PORT, () => {
    console.log('server is running on port', PORT)
  })
})
