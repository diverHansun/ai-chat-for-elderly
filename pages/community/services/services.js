Page({
  data: {
    name: '',
    address: '',
    phone: '',
    serviceTypeArray: ['上门检测', '家政服务', '医疗陪护', '送餐服务'],
    serviceTypeIndex: 0,
    date: '',
    time: '',
    loading: false,
    reservations: [],
    listLoading: false
  },

  onShow() {
    this.fetchReservations()
  },
  // —— 拉取“我的预约”列表
  fetchReservations() {
    this.setData({ listLoading: true })
    wx.cloud.callFunction({
      name: 'services',
      data: { action: 'list' }
    })
      .then(({ result }) => {
        if (result.success) {
          // 将 Date 类型转回字符串方便显示
          const data = result.data.map(item => ({
            ...item,
            appointmentTime: new Date(item.appointmentTime).toLocaleString(),
          }))
          this.setData({ reservations: data })
        } else {
          wx.showToast({ title: '拉取预约失败', icon: 'none' })
        }
      })
      .catch(err => {
        console.error('fetchReservations error', err)
        wx.showToast({ title: '网络错误', icon: 'none' })
      })
      .finally(() => {
        this.setData({ listLoading: false })
      })
  },
  // 姓名输入
  onNameInput(e) {
    this.setData({ name: e.detail.value });
  },

  // 住址输入
  onAddressInput(e) {
    this.setData({ address: e.detail.value });
  },

  // 手机号输入
  onPhoneInput(e) {
    this.setData({ phone: e.detail.value });
  },

  // 服务类型选择
  onServiceTypeChange(e) {
    this.setData({ serviceTypeIndex: e.detail.value });
  },

  // 日期选择
  onDateChange(e) {
    this.setData({ date: e.detail.value });
  },

  // 时间选择
  onTimeChange(e) {
    this.setData({ time: e.detail.value });
  },

  // 提交表单
  submitForm() {
    const {
      name,
      address,
      phone,
      serviceTypeArray,
      serviceTypeIndex,
      date,
      time
    } = this.data;

    // 简单校验
    if (!name || !address || !phone || !date || !time) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      });
      return;
    }
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      wx.showToast({
        title: '手机号格式不正确',
        icon: 'none'
      });
      return;
    }

    const serviceType = serviceTypeArray[serviceTypeIndex];
    const appointmentTime = `${date} ${time}:00`;

    this.setData({ loading: true });

    wx.cloud.callFunction({
      name: 'services',
      data: {
        name,
        address,
        phone,
        serviceType,
        appointmentTime
      }
    })
      .then(res => {
        this.setData({ loading: false });
        if (res.result.success) {
          wx.showToast({ title: '预约成功' });
          // 重置表单
          this.setData({
            name: '',
            address: '',
            phone: '',
            serviceTypeIndex: 0,
            date: '',
            time: ''
          });
        } else {
          wx.showModal({
            title: '提交失败',
            content: res.result.message,
            showCancel: false
          });
        }
      })
      .catch(err => {
        this.setData({ loading: false });
        wx.showModal({
          title: '错误',
          content: '网络或服务器异常，请稍后重试',
          showCancel: false
        });
        console.error('callFunction services error:', err);
      });
  }
});
