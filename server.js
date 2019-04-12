'use strict'
/**
 *  在本地启动时不要运行 node server.js
 *  正确命令在 package.json 中
 */
const express = require('express')
// const bodyParser = require('body-parser')
const path = require('path')
const morgan = require('morgan')
const compression = require('compression')
const config = require('config')
const timeout = require('connect-timeout')
const proxy = require('http-proxy-middleware')
const history = require('connect-history-api-fallback')
// 超时时间
const TIME_OUT = 5 * 60 * 1000 // 超时时间 ms

const uuid = require('node-uuid')

function assignId(req, res, next) {
  req.id = uuid.v4()
  next()
}

morgan.token('id', function getId(req) {
  return req.id
})
const app = express()

app.use(assignId)

// app.use(morgan(':id :method :url :response-time ms'))

// 设置超时 返回超时响应
app.use(timeout(TIME_OUT))
app.use((req, res, next) => {
  if (!req.timedout) next()
})

if (config.get('gZip')) {
  app.use(compression())
}

// app.set('views', path.join(__dirname, 'views'))
// app.set('view engine', 'pug')
app.enable('trust proxy')

// if (config.get('local')) {
//   app.disable('view cache')
// }

app.use((req, res, next) => {
  res.status(200)
  next()
})

app.use(history({
  index: '/index.html',
  // verbose: true,
}))

app.use(express.static(path.join(__dirname, 'dist')))
app.use(express.static(path.join(__dirname, 'public')))

// app.use(cookieParser())
// app.use(cookieSession({
//   name: 'fjk-session',
//   secret: '44M4KAY%62yFYq.(fTRg4D@^>8Wb=K7(',
//   maxAge: 1000 * 3600 * 24 * 20
// }))

// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({
//   extended: false
// }))

// app.use(routes)
// 反向代理
if (!config.get('disableProxy')) {
  const proxyOption = {
    target: config.get('apiHost'),
    pathRewrite: {
      '^/api/': '/' // 重写请求，api/解析为/
    },
    changeOrigin: true,
  }

  app.use('/api/*', morgan(':id :method :url :response-time ms'), proxy(proxyOption))
}

// app.get('/', function(req, res) {
//   res.sendFile('dist/index.html', { root: __dirname })
// })

// catch 404 and forward to err handler
app.use((req, res, next) => {
  const err = new Error(' 404 Not Found')
  err.status = 404

  if (req.path.indexOf('/api') !== -1) {
    return next(err)
  }

  res.redirect('/404')
})

module.exports = app
