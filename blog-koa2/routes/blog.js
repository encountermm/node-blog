const router = require('koa-router')()

router.prefix('/api/blog')

const { getList, getDetail, newBlog, updateBlog, deleteBlog } = require('../controller/blog')
const { SuccessModal, ErrorModal } = require('../model/resModal')
const loginCheck = require('../middleWare/loginCheck')
// list
router.get('/list', async (ctx, next) => {
  let author = ctx.query.author || ''
  const keyword = ctx.query.keyword || ''

  if (ctx.query.isadmin) {
    console.log('is admin')

    // 管理员界面
    if (ctx.session.username === null) {
      // 未登录
      ctx.body = new ErrorModal('未登录')
      return
    }
    // 强制查询自己的博客
    author = ctx.session.username
  }

  const listData = await getList(author, keyword)
  ctx.body = new SuccessModal(listData)
})
// detail
router.get('/detail', async (ctx, next) => {
  const id = ctx.query.id || ''
  const data = await getDetail(id)
  ctx.body = new SuccessModal(data)
})

// new
router.post('/new', loginCheck, async (ctx, next) => {
  ctx.request.body.author = ctx.session.username
  const data = await newBlog(ctx.request.body)
  ctx.body = new SuccessModal(data)
})

// update
router.post('/update', loginCheck, async (ctx, next) => {
  const data = await updateBlog(ctx.request.body)
  if (data) {
    ctx.body = new SuccessModal()
  } else {
    ctx.body = new ErrorModal('更新失败')
  }
})

// delete
router.post('/delete', loginCheck, async (ctx, next) => {
  const id = ctx.request.body.id
  const author = ctx.session.username

  const data = await deleteBlog(id, author)
  if (data) {
    ctx.body = new SuccessModal()
  } else {
    ctx.body = new ErrorModal('删除失败')
  }
})

module.exports = router
