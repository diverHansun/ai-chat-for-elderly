// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const db = cloud.database()
const users = db.collection('users')

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  const { nickname, avatarUrl, role } = event

  // 查询是否已存在该用户
  const check = await users.where({ _openid: openid }).get()
  if (check.data.length > 0) {
    return {
      message: '用户已存在',
      userInfo: check.data[0]
    }
  }

  // 写入新用户
  const res = await users.add({
    data: {
      _openid: openid,
      nickname: nickname || '匿名用户',
      avatarUrl: avatarUrl || '',
      role: role || 'elder', // 默认身份为 elder
      createdAt: new Date()
    }
  })

  return {
    message: '注册成功',
    _id: res._id
  }
}
