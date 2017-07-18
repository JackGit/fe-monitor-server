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
const app = new Koa()
const PORT = config.PORT

AV.init({
  appId: config.AV.APP_ID,
  appKey: config.AV.APP_KEY
})

// error handling
onerror(app)
app.on('error', (err, ctx) => {
  console.error('app error')
})

// logger
app.use(koaLogger())

// body parser
app.use(bodyParser())

// routers
app.use(router.routes())

app.listen(PORT, () => {
  console.log('server is running on port', PORT)
})
