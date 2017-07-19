const path = require('path')
const Koa = require('koa')
const serve = require('koa-static')
const koaLogger = require('koa-logger')
const onerror = require('koa-onerror')
const favicon = require('koa-favicon')
const bodyParser = require('koa-bodyparser')
const AV = require('leancloud-storage')
const config = require('./config')
const router = require('./routers')
const cors = require('kcors')
const app = new Koa()
const PORT = config.PORT

process.env.DEBUG = 'leancloud*'

AV.init({
  appId: config.AV.APP_ID,
  appKey: config.AV.APP_KEY
})

// error handling
onerror(app)
app.on('error', (err, ctx) => {
  console.error('app error', err)
})

// logger
app.use(koaLogger())

// cros
const ALLOW_CROSS_ORIGIN_DOMAINS = ['http://192.168.1.103:8000']
app.use(cors({
  origin (ctx) {
    let o = ctx.request.headers.origin
    if (ALLOW_CROSS_ORIGIN_DOMAINS.filter(domain => o.endsWith(domain)).length > 0) {
      return o
    }
  }
}))

// body parser
app.use(bodyParser())

// routers
app.use(router.routes())

app.listen(PORT, () => {
  console.log('server is running on port', PORT)
})
