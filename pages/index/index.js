// pages/index/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    welcomeMsg: "欢迎来到AI聊天小程序！"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log("Index 页面 onLoad，参数：", options);
    // 可以在这里做一些初始化操作，例如获取用户信息等
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    console.log("Index 页面 onReady，页面初次渲染完成");
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    console.log("Index 页面 onShow，页面显示");
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    console.log("Index 页面 onHide，页面隐藏");
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    console.log("Index 页面 onUnload，页面卸载");
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    console.log("用户下拉刷新 Index 页面");
    // 如有需要，可在此处进行数据刷新
    // 调用停止下拉刷新的方法
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    console.log("用户已触底 Index 页面");
    // 可在这里加载更多数据
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    console.log("用户点击分享按钮");
    return {
      title: 'AI聊天小程序',
      path: '/pages/index/index'
    }
  },

  /**
   * 自定义方法：跳转到 chatAI 页面
   */
  goChatAI() {
    wx.navigateTo({
      url: '/pages/chatAI/chatAI',
      success: (res) => {
        console.log("成功跳转到 chatAI 页面");
      },
      fail: (err) => {
        console.error("跳转到 chatAI 页面失败：", err);
      }
    });
  }
});
