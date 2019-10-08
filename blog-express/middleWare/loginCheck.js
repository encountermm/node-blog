const { ErrorModal } = require('../model/resModal')

module.exports = (req, res, next) => {
  if (req.session.username) {
    next()
    return
  }
  res.json(new ErrorModal('尚未登录,请先登录'))
}
