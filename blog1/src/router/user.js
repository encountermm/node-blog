const { login } = require('../controller/user')
const { SuccessModal, ErrorModal } = require('../model/resModal')
const { set } = require('../db/redis')

const handleUserRouter = (req, res) => {
	const method = req.method //POST OR GET
	const path = req.path

	// 用户登录
	if (method === 'POST' && path === '/api/user/login') {
		const { username, password } = req.body
		const result = login(username, password)
		return result.then(data => {
			if (data.username) {
				// 设置session
				req.session.username = data.username
				req.session.realName = data.realname
				// console.log('req.sessionId------' + req.sessionId)

				// 同步到redis
				set(req.sessionId, req.session)

				return new SuccessModal()
			} else {
				return new ErrorModal('登录失败')
			}
		})
	}
	// 登录验证的测试
	// if (method === 'GET' && path === '/api/user/loginTest') {
	// 	if (req.session.username) {
	// 		return Promise.resolve(
	// 			new SuccessModal({
	// 				session: req.session
	// 			})
	// 		)
	// 	} else {
	// 		return Promise.resolve(new ErrorModal('尚未登录'))
	// 	}
	// }
}

module.exports = handleUserRouter
