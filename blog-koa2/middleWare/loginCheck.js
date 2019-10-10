const { ErrorModal } = require('../model/resModal')

module.exports = async (ctx, next) => {
  if (ctx.session.username) {
    await next()
    return
  }
  ctx.body = new ErrorModal('尚未登录,请先登录')
}
