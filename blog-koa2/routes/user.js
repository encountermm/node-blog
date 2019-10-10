const router = require('koa-router')()
router.prefix('/api/user')

const { login } = require('../controller/user')
const { SuccessModal, ErrorModal } = require('../model/resModal')

router.post('/login', async function(ctx, next) {
  const { username, password } = ctx.request.body

  const data = await login(username, password)

  if (data.username) {
    // 设置session
    ctx.session.username = data.username
    ctx.session.realName = data.realname
    ctx.body = new SuccessModal()
  } else {
    ctx.body = new ErrorModal('登录失败')
  }
})

module.exports = router
