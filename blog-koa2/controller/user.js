const { exec, escape } = require('../db/mysql')
const { genPassword } = require('../util/cryp')

/**
 * 登录
 * @param {} username
 * @param {*} password
 * @returns
 */
const login = async (username, password) => {
  username = escape(username)
  // 生成加密密码 需要在escape前
  password = genPassword(password)

  password = escape(password)
  const sql = `select username,realname from users where username=${username} and password=${password};`

  const rows = await exec(sql)
  return rows[0] || {}
}

module.exports = {
  login
}
