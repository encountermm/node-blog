var express = require('express')
var router = express.Router()
const { getList, getDetail, newBlog, updateBlog, deleteBlog } = require('../controller/blog')
const { SuccessModal, ErrorModal } = require('../model/resModal')
const loginCheck = require('../middleWare/loginCheck')

// list
router.get('/list', (req, res, next) => {
  let author = req.query.author || ''
  const keyword = req.query.keyword || ''

  if (req.query.isadmin) {
    // 管理员界面
    if (req.session.username === null) {
      // 未登录
      res.json(new ErrorModal('未登录'))
      return
    }
    //   const loginCheckResult = loginCheck(req)
    //   if (loginCheckResult) {
    //     return loginCheckResult
    //   }
    // 强制查询自己的博客
    author = req.session.username
  }

  const result = getList(author, keyword)
  return result.then(data => {
    res.json(new SuccessModal(data))
  })
})
// detail
router.get('/detail', (req, res, next) => {
  const id = req.query.id || ''
  const result = getDetail(id)
  return result.then(data => {
    res.json(new SuccessModal(data))
  })
})

// delete
router.post('/delete', loginCheck, (req, res, next) => {
  const id = req.body.id
  const author = req.session.username
  const result = deleteBlog(id, author)
  return result.then(data => {
    if (data) {
      res.json(new SuccessModal())
    } else {
      res.json(new new ErrorModal('删除失败')())
    }
  })
})

// new
router.post('/new', loginCheck, (req, res, next) => {
  req.body.author = req.session.username
  const result = newBlog(req.body)
  return result.then(data => {
    res.json(new SuccessModal(data))
  })
})

// update
router.post('/update', loginCheck, (req, res, next) => {
  const result = updateBlog(req.body)
  return result.then(data => {
    if (data) {
      res.json(new SuccessModal())
    } else {
      res.json(new ErrorModal('更新失败'))
    }
  })
})

module.exports = router
