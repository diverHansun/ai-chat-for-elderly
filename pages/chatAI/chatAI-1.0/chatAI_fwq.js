// pages/chatAI/chatAI.js
Page({
  data: {
    inputValue: "", // 存储输入框内容
    chatHistory: [] // 聊天记录
  },

  onLoad(options) {
    console.log("chatAI onLoad");
  },

  // 输入框事件：实时更新 inputValue
  handleInput(e) {
    this.setData({
      inputValue: e.detail.value
    });
  },

  // 发送消息：调用后端 API 获取 AI 回复
  sendMessage() {
    const message = this.data.inputValue.trim();
    if (!message) return; // 输入为空则不发送

    const userAvatar = "/pages/chatAI/images/user.png";
    const aiAvatar = "/pages/chatAI/images/ai.png";

    // 1. 将用户消息添加到 chatHistory，并清空输入框
    const newHistory = this.data.chatHistory.concat([
      { userType: "user", content: message, avatar: userAvatar }
    ]);
    this.setData({
      chatHistory: newHistory,
      inputValue: ""
    });

    // 2. 通过 wx.request 调用后端 API 获取 AI 回复
    wx.request({
      url: "http://127.0.0.1:5000/api/chat", // 替换为你的后端服务器地址
      method: "POST",
      data: {
        message: message
      },
      header: {
        "content-type": "application/json"
      },
      success: (res) => {
        if (res.data && res.data.code === 200) {
          // 3. 将 AI 回复添加到 chatHistory
          const aiReply = res.data.data;
          const updatedHistory = this.data.chatHistory.concat([
            { userType: "ai", content: aiReply, avatar: aiAvatar }
          ]);
          this.setData({ chatHistory: updatedHistory });
        } else {
          console.error("API 返回错误:", res.data ? res.data.message : res);
        }
      },
      fail: (err) => {
        console.error("请求失败:", err);
      }
    });
  }
});
