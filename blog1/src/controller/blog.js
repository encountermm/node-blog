const xss = require('xss')
const { exec } = require('../db/mysql')

/**
 * 获取博客列表
 * @param {} author
 * @param {*} keyword
 * @returns
 */
const getList = (author, keyword) => {
  let sql = `select id,title,content,createtime,author from blogs where 1=1 `
  if (author) {
    sql += `and author='${author}' `
  }
  if (keyword) {
    sql += `and title like '%${keyword}%' `
  }
  sql += `order by createtime desc`
  // 返回promise
  return exec(sql)
}

/**
 * 获取博客详情
 * @param {} id
 * @returns
 */
const getDetail = id => {
  const sql = `select * from blogs where id=${id};`
  return exec(sql).then(rows => {
    return rows[0]
  })
}

/**
 * 新建博客
 * @param {} blogData
 * @returns
 */
const newBlog = blogData => {
  const title = xss(blogData.title)
  const content = xss(blogData.content)
  const author = blogData.author
  const createtime = Date.now()

  const sql = `
		insert into blogs (title,content,createtime,author) values 
		('${title}','${content}',${createtime},'${author}');
	`

  return exec(sql).then(data => {
    return {
      id: data.insertId
    }
  })
}

/**
 * 更新博客
 * @param {} blogData
 * @returns
 */
const updateBlog = blogData => {
  const { id, title, content } = blogData

  const sql = `
		update blogs set title='${title}',
		content='${content}' where id=${id};
	`
  return exec(sql).then(data => {
    return data.affectedRows > 0
  })
}

/**
 * 删除博客
 * @param {} id
 * @returns
 */
const deleteBlog = (id, author) => {
  const sql = `
		delete from blogs where id=${id} and author='${author}';
	`
  return exec(sql).then(data => {
    return data.affectedRows > 0
  })
}

module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  deleteBlog
}
