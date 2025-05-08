Page({
  data: {
    announcements: [],
    showPublishModal: false,
    title: '',
    content: '',
    role: '', // 用于判断权限
  },

  onLoad() {
    this.fetchAnnouncements()
    this.getUserRole()
  },

  async getUserRole() {
    try {
      const res = await wx.cloud.callFunction({
        name: 'announcements',
        data: { action: 'getUserRole' }
      })
      console.log('获取身份返回', res.result)          // ➜ ①
      const role = res.result.data.role
      this.setData({ role }, () => {
        console.log('已写入 role =', this.data.role) // ➜ ②
      })
    } catch (e) {
      console.error('获取身份失败', e)
    }
  },

  /* 获取公告列表 */
  async fetchAnnouncements() {
    wx.showLoading({ title: '加载中...' })
    try {
      const res = await wx.cloud.callFunction({
        name: 'announcements',
        data: { action: 'getAnnouncements' }   // ←① 改这里
      })
      console.log('云函数返回', res.result)
      if (res.result.code !== 0 || !Array.isArray(res.result.data)) {
        throw new Error(res.result.msg || '获取公告失败')
      }

      const list = res.result.data.map(item => ({
        ...item,
        timeStr: new Date(item.createdAt).toLocaleString()  // ←② 改字段
      }))
      this.setData({ announcements: list })
    } catch (err) {
      console.error(err)
      wx.showToast({ icon: 'none', title: '获取公告失败' })
    } finally {
      wx.hideLoading()
    }
  },

  /* 打开发布弹窗（可选的前端权限拦截） */
  openPublishModal() {
    if (this.data.role !== 'staff') {
      return wx.showToast({ title: '您无权发布', icon: 'none' })  // ←③ 友好提示
    }
    this.setData({ showPublishModal: true })
  },

  closePublishModal() {
    this.setData({ showPublishModal: false, title: '', content: '' })
  },

  onTitleInput(e) {
    this.setData({ title: e.detail.value })
  },
  onContentInput(e) {
    this.setData({ content: e.detail.value })
  },

  async submitAnnouncement() {
    const { title, content } = this.data
    if (!title || !content) {
      return wx.showToast({ title: '请填写内容', icon: 'none' })
    }
    wx.showLoading({ title: '发布中' })
    try {
      await wx.cloud.callFunction({
        name: 'announcements',
        data: {
          action: 'postAnnouncement',
          title,
          content
        }
      })
      wx.showToast({ title: '发布成功' })
      this.closePublishModal()
      this.fetchAnnouncements()
    } catch (err) {
      console.error('发布失败', err)
      wx.showToast({ title: '发布失败', icon: 'none' })
    } finally {
      wx.hideLoading()
    }
  },
  onDelete(e) {
    const _id = e.currentTarget.dataset.id
    wx.showModal({
      title: '删除公告',
      content: '确定要删除这条公告吗？',
      success: (dlg) => {
        if (!dlg.confirm) return
        wx.showLoading({ title: '删除中...' })
        wx.cloud.callFunction({
          name: 'announcements',
          data: { action: 'deleteAnnouncement', announcementId: _id }
        })
          .then(res => {
            wx.hideLoading()
            if (res.result.code === 0) {
              wx.showToast({ title: '已删除' })
              // 本地同步移除
              this.setData({
                announcements: this.data.announcements.filter(a => a._id !== _id)
              })
            } else {
              wx.showToast({ icon: 'none', title: res.result.msg })
            }
          })
          .catch(err => {
            wx.hideLoading()
            wx.showToast({ icon: 'none', title: '删除失败' })
            console.error('delete err', err)
          })
      }
    })
  }
})
