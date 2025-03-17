// chatAI.js
Page({
  data: {
    inputValue: "",
    chatHistory: []
  },
  onLoad() {
    wx.cloud.init();
  },
  handleInput(e) {
    this.setData({
      inputValue: e.detail.value
    });
  },
  sendMessage() {
    const message = this.data.inputValue.trim();
    if (!message) return;

    const userAvatar = "/pages/chatAI/images/user.png";
    const aiAvatar = "/pages/chatAI/images/ai.png";

    // 1. 先把用户的输入 push 到 chatHistory
    const newHistory = this.data.chatHistory.concat([
      { userType: "user", content: message, avatar: userAvatar }
    ]);
    this.setData({
      chatHistory: newHistory,
      inputValue: ""
    });

    // 2. 调用云函数
    wx.cloud.callFunction({
      name: "chatAI",
      data: { message },
      success: (res) => {
        console.log("云函数返回:", res);
        if (res.result && res.result.code === 200) {
          // 3. AI 返回的是 HTML
          const aiReplyHtml = res.result.data;
          // 4. 放到 chatHistory
          const updatedHistory = this.data.chatHistory.concat([
            { userType: "ai", content: aiReplyHtml, avatar: aiAvatar }
          ]);
          this.setData({ chatHistory: updatedHistory });
        } else {
          console.error("云函数返回错误:", res.result);
        }
      },
      fail: (err) => {
        console.error("调用云函数失败:", err);
      }
    });
  }
});
