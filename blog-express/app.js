var createError = require('http-errors')
var express = require('express')
var path = require('path')
const fs = require('fs')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
const session = require('express-session')
const RedisStore = require('connect-redis')(session)

var blogRouter = require('./routes/blog')
var userRouter = require('./routes/user')

var app = express()

// view engine setup
// app.set('views', path.join(__dirname, 'views'))
// app.set('view engine', 'jade')

const ENV = process.env.NODE_ENV

if (ENV === 'production') {
  // 线上环境
  const logFileName = path.join(__dirname, 'logs/access.log')
  const writeStream = fs.createWriteStream(logFileName, {
    flags: 'a'
  })
  app.use(
    logger('combined', {
      stream: writeStream
    })
  )
} else {
  // 开发环境 /测试环境
  app.use(
    logger('dev', {
      stream: process.stdout
    })
  )
}

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
// app.use(express.static(path.join(__dirname, 'public')))

// redis配置
const redisClient = require('./db/redis')
const sessionStore = new RedisStore({
  client: redisClient
})
// 设置 session
app.use(
  session({
    resave: false, //添加 resave 选项
    saveUninitialized: true, //添加 saveUninitialized 选项
    secret: 'KIMI_20180326',
    // 配置cookie
    cookie: {
      path: '/', //默认配置
      httpOnly: true, //默认配置
      maxAge: 24 * 60 * 60 * 1000 //失效时间
    },
    store: sessionStore
  })
)

app.use('/api/blog', blogRouter)
app.use('/api/user', userRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
