const querystring = require('querystring')
const handlleBlogRouter = require('./src/router/blog')
const handlleUserRouter = require('./src/router/user')
const { get, set } = require('./src/db/redis')
const { access } = require('./src/util/log')

// 获取cookie的过期时间
const getCookieExpires = () => {
  const d = new Date()
  d.setTime(d.getTime() + 24 * 60 * 60 * 1000)
  return d.toGMTString()
}

// session 数据
// const SESSION_DATA = {}

const getPostData = req => {
  const promise = new Promise((resolve, reject) => {
    if (req.method !== 'POST') {
      resolve({})
      return
    }
    if (req.headers['content-type'] !== 'application/json') {
      resolve({})
      return
    }
    let postData = ''
    req.on('data', chunk => {
      postData += chunk.toString()
    })
    req.on('end', () => {
      if (!postData) {
        resolve({})
        return
      }
      resolve(JSON.parse(postData))
    })
  })
  return promise
}

const serverHandle = (req, res) => {
  // 记录access log
  access(`${req.method} -- ${req.url} -- ${req.headers['user-agent']} -- ${Date.now()}`)

  // 设置返回格式JSON
  res.setHeader('Content-Type', 'application/json')

  // 获取path
  const url = req.url
  req.path = url.split('?')[0]

  // 解析 query
  req.query = querystring.parse(url.split('?')[1])

  // 解析cookie
  req.cookie = {}
  const cookieStr = req.headers.cookie || ''
  cookieStr.split(';').forEach(item => {
    if (!item) return
    const arr = item.split('=')
    const key = arr[0].trim()
    const value = arr[1].trim()
    req.cookie[key] = value
  })

  // 解析session
  // let needSetCookie = false
  // let userId = req.cookie.userid
  // if (userId) {
  // 	if (!SESSION_DATA[userId]) {
  // 		SESSION_DATA[userId] = {}
  // 	}
  // } else {
  // 	needSetCookie = true
  // 	userId = `${Date.now()}_${Math.random()}`
  // 	SESSION_DATA[userId] = {}
  // }
  // req.session = SESSION_DATA[userId]

  // 解析session 使用redis
  let needSetCookie = false
  let userId = req.cookie.userid
  if (!userId) {
    needSetCookie = true
    userId = `${Date.now()}_${Math.random()}`
    // 初始化redis找那个session的初始值
    set(userId, {})
  }
  // 为req创建一个sessionId的属性
  req.sessionId = userId
  console.log(`app sessionId ${req.sessionId}`)
  const getRedisSessionResult = get(req.sessionId).then(sessionData => {
    // console.log("sessionData",sessionData);

    if (!sessionData) {
      // 初始化redis中session的初始值
      set(req.sessionId, {})
      // 设置session
      req.session = {}
    } else {
      req.session = sessionData
    }
    // 返回getPostData的promise
    return getPostData(req)
  })

  // 处理postdata
  getRedisSessionResult.then(postData => {
    req.body = postData

    // 处理blog路由
    const blogResult = handlleBlogRouter(req, res)
    if (blogResult) {
      blogResult.then(blogData => {
        if (needSetCookie) {
          res.setHeader(
            'Set-Cookie',
            `userid=${userId};path=/;httpOnly;expires=${getCookieExpires()};`
          )
        }

        res.end(JSON.stringify(blogData))
      })
      return
    }

    // 处理user路由
    const userData = handlleUserRouter(req, res)
    if (userData) {
      userData.then(userData => {
        if (needSetCookie) {
          res.setHeader(
            'Set-Cookie',
            `userid=${userId};path=/;httpOnly;expires=${getCookieExpires()};`
          )
        }
        res.end(JSON.stringify(userData))
      })
      return
    }

    // 未定义路由
    res.writeHead(404, { 'Content-Type': 'text/plain' })
    res.write('404 Not Found\n')
    res.end()
  })
}

module.exports = serverHandle

// process.env.NODE_ENV
