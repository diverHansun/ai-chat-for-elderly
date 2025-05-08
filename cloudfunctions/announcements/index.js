// cloudfunctions/announcements/index.js
const cloud = require('wx-server-sdk')
const config = require('./config.json')           // 需包含 { "adminOpenIds": ["openid1", ...] }

const adminList = Array.isArray(config.adminOpenIds) ? config.adminOpenIds : []
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const announcements = db.collection('announcements')

/* ---------- 工具函数 ---------- */
/**
 * 统一成功返回
 */
const ok = (data = {}) => ({ code: 0, msg: 'OK', data })
// 取当前用户 role（不存在默认为 elder）
async function getRole(openid) {
  const res = await db.collection('users')
    .where({ _openid: openid })
    .limit(1)
    .get()
  return res.data[0]?.role || 'elder'
}


/* ---------- 主入口 ---------- */
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  /** ---------- 兼容旧调用 ---------- */
  // 若仍使用 { method:'GET', type:'announcement' } 调用，则映射到 action
  let action = event.action
  if (!action && event.type === 'announcement') {
    action = event.method === 'POST' ? 'postAnnouncement' : 'getAnnouncements'
  }

  /** ---------- 路由分发 ---------- */
  switch (action) {
    /******** 获取当前用户角色 ********/
    case 'getUserRole': {
      const role = await getRole(openid)
      return ok({ role })
    }

    /* 发布公告 —— 仅 staff */
    case 'postAnnouncement': {
      if (await getRole(openid) !== 'staff') {
        return { code: 403, msg: '权限不足：仅管理员可发布公告' }
      }

      const { title, content } = event
      if (!title || !content) {
        return { code: 400, msg: '缺少 title 或 content' }
      }

      const createdAt = new Date()
      try {
        const addRes = await announcements.add({
          data: { title, content, createdAt }
        })
        return ok({ _id: addRes._id, title, content, createdAt })
      } catch (err) {
        console.error('公告写入失败', err)
        return { code: 500, msg: '数据库写入失败', error: err }
      }
    }

    /* 获取公告 —— 所有人 */
    case 'getAnnouncements': {
      try {
        const res = await announcements.orderBy('createdAt', 'desc').get()
        return ok(res.data || [])
      } catch (err) {
        console.error('公告读取失败', err)
        return { code: 500, msg: '数据库读取失败', error: err }
      }
    }
    /* 删除公告 —— 仅 staff */
    case 'deleteAnnouncement': {
      const { announcementId } = event
      if (await getRole(openid) !== 'staff') {
        return { code: 403, msg: '无删除权限' }
      }

      try {
        await announcements.doc(announcementId).remove()
        return ok()
      } catch (err) {
        console.error('删除失败', err)
        return { code: 500, msg: '数据库删除失败', error: err }
      }
    }

    /* 兜底 */
    default:
      return { code: 400, msg: 'Invalid action' }
  }
}
