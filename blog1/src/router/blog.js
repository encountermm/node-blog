const { getList, getDetail, newBlog, updateBlog, deleteBlog } = require('../controller/blog')
const { SuccessModal, ErrorModal } = require('../model/resModal')

// 统一的登录验证函数
const loginCheck = req => {
	if (!req.session.username) {
		return Promise.resolve(new ErrorModal('尚未登录，请先登录'))
	}
}

const handleBlogRouter = (req, res) => {
	const method = req.method //POST OR GET
	const path = req.path

	// 获取博客列表
	if (method === 'GET' && path === '/api/blog/list') {
		let author = req.query.author || ''
		const keyword = req.query.keyword || ''

		if (req.query.isadmin) {
			// 管理员界面
			const loginCheckResult = loginCheck(req)
			if (loginCheckResult) {
				return loginCheckResult
			}
			// 强制查询自己的博客
			author = req.session.username
		}

		const result = getList(author, keyword)
		return result.then(data => {
			return new SuccessModal(data)
		})
	}

	// 获取博客详情
	if (method === 'GET' && path === '/api/blog/detail') {
		const id = req.query.id || ''
		const result = getDetail(id)
		return result.then(data => {
			return new SuccessModal(data)
		})
	}

	// 新建博客
	if (method === 'POST' && path === '/api/blog/new') {
		const loginCheckResult = loginCheck(req)
		if (loginCheckResult) {
			return loginCheckResult
		}

		req.body.author = req.session.username
		const result = newBlog(req.body)
		return result.then(data => {
			return new SuccessModal(data)
		})
	}

	// 更新博客
	if (method === 'POST' && path === '/api/blog/update') {
		const loginCheckResult = loginCheck(req)
		if (loginCheckResult) {
			return loginCheckResult
		}

		const result = updateBlog(req.body)
		return result.then(data => {
			if (data) {
				return new SuccessModal()
			} else {
				return new ErrorModal('更新失败')
			}
		})
	}

	// 删除博客
	if (method === 'POST' && path === '/api/blog/delete') {
		const loginCheckResult = loginCheck(req)
		if (loginCheckResult) {
			return loginCheckResult
		}

		const id = req.body.id
		const author = req.session.username
		const result = deleteBlog(id, author)
		return result.then(data => {
			if (data) {
				return new SuccessModal()
			} else {
				return new ErrorModal('删除失败')
			}
		})
	}
}

module.exports = handleBlogRouter
