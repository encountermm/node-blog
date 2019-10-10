const crypto = require('crypto')

// 密钥
const SECKRET_KEY = 'KIMI_20180326#'

// md5加密
function md5(content) {
  let md5 = crypto.createHash('md5')
  return md5.update(content).digest('hex')
}

// 加密函数
function genPassword(password) {
  const str = `password=${password}key=${SECKRET_KEY}`
  return md5(str)
}

module.exports = {
  genPassword
}
