// 云函数入口文件
const cloud = require('wx-server-sdk');
const config = require('./config.json');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const announcements = db.collection('announcements');

exports.main = async (event, context) => {
  const { method, type, body } = event;
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;

  // 仅处理 type === 'announcement'
  if (type !== 'announcement') {
    return { code: 400, msg: 'Invalid type' };
  }

  // 发布公告 —— 仅管理员
  if (method === 'POST') {
    if (!config.adminOpenIds.includes(openid)) {
      return { code: 403, msg: '权限不足：只有管理员可发布公告' };
    }
    const { title, content } = body;
    if (!title || !content) {
      return { code: 400, msg: '参数缺失：需要 title 和 content' };
    }

    try {
      const now = new Date();
      const addRes = await announcements.add({
        data: { title, content, timestamp: now }
      });
      return {
        code: 0,
        msg: '公告发布成功',
        data: {
          _id: addRes._id,
          title,
          content,
          timestamp: now
        }
      };
    } catch (err) {
      return { code: 500, msg: '数据库写入失败', error: err };
    }
  }

  // 获取公告列表 —— 所有用户（管理员+普通用户）
  if (method === 'GET') {
    try {
      const queryRes = await announcements
        .orderBy('timestamp', 'desc')
        .get();
      return { code: 0, data: queryRes.data };
    } catch (err) {
      return { code: 500, msg: '数据库读取失败', error: err };
    }
  }

  // 其他情况
  return { code: 400, msg: 'Invalid method' };
};
