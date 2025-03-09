// app.js
App({
  onLaunch() {
    console.log("App Launch - 小程序初始化");
    // 在这里可以做一些全局初始化操作
    this.doSomeInitialization();
  },

  onShow(options) {
    console.log("App Show - scene:", options.scene);
    // 如果需要在小程序从后台进入前台时做处理，可以写在这里
  },

  onHide() {
    console.log("App Hide - 进入后台");
  },

  onError(err) {
    console.error("小程序错误:", err);
  },

  doSomeInitialization() {
    // 示例：全局初始化逻辑，如获取用户信息、加载远端配置等
    console.log("执行一些初始化操作...");
  },

  globalData: {
    userInfo: null,
    baseURL: "http://localhost:8080"
  }
});
