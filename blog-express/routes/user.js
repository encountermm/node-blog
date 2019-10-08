var express = require('express')
var router = express.Router()
const { login } = require('../controller/user')
const { SuccessModal, ErrorModal } = require('../model/resModal')
// const { set } = require('../db/redis')

/* GET users listing. */
router.post('/login', function(req, res, next) {
  const { username, password } = req.body

  const result = login(username, password)
  return result.then(data => {
    if (data.username) {
      // 设置session
      req.session.username = data.username
      req.session.realName = data.realname

      res.json(new SuccessModal())
    } else {
      res.json(new ErrorModal('登录失败'))
    }
  })
})

module.exports = router
