// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })    // 使用当前云环境
const db = cloud.database()

// 主入口
exports.main = async (event, context) => {
  const { OPENID: openid } = cloud.getWXContext()
  const { action,name, address, phone, serviceType, appointmentTime } = event

  if (action === 'list') {
    // 查询当前用户的预约，按创建时间倒序
    console.log('list action, current openid =', openid)
    const snap = await db
      .collection('service_reservations')
      .where({ userOpenId: openid })
      .orderBy('createdAt', 'desc')
      .get()
    return { success: true, data: snap.data }
  }
  // —— 一、基础校验 —— 
  if (!name || !address || !phone || !serviceType || !appointmentTime) {
    return { success: false, message: '缺少必要参数，请检查 name,address,phone,serviceType,appointmentTime' }
  }
  // 简单手机号校验
  if (!/^1[3-9]\d{9}$/.test(phone)) {
    return { success: false, message: '手机号格式不正确' }
  }
  // 解析预约时间
  const appt = new Date(appointmentTime)
  if (isNaN(appt.getTime())) {
    return { success: false, message: 'appointmentTime 无法识别为有效时间' }
  }

  // —— 二、拉取用户 profile —— 
  let userNickname = ''
  try {
    const userSnap = await db
      .collection('users')
      .where({ _openid: openid })
      .limit(1)
      .get()
    if (userSnap.data.length > 0) {
      userNickname = userSnap.data[0].nickname || ''

    }
  } catch (e) {
    console.warn('拉取 users 失败，继续写入预约：', e)
  }

  // —— 三、构造写入数据 —— 
  const now = new Date()
  const reservationData = {
    userNickname,
    name,
    address,
    phone,
    serviceType,
    appointmentTime: appt,
    status: 'pending',  // pending/confirmed/completed …
    createdAt: now,
    updatedAt: now
  }

  // —— 四、写入 service_reservations 集合 —— 
  try {
    const { _id } = await db
      .collection('service_reservations')
      .add({ data: reservationData })
    return { success: true, id: _id, message: '预约提交成功' }
  } catch (err) {
    console.error('写入 service_reservations 失败：', err)
    return { success: false, message: '服务器错误，预约提交失败' }
  }
}
