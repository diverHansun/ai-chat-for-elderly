// pages/chatAI/chatAI.js
Page({
  data: {
    inputValue: '',      // 存储输入框内容
    chatHistory: []      // 聊天记录
  },

  onLoad(options) {
    // 页面加载时，可执行初始化操作
    console.log("chatAI onLoad");
  },

  // 输入框事件：实时更新 inputValue
  handleInput(e) {
    this.setData({
      inputValue: e.detail.value
    });
  },

  // 发送消息
  sendMessage() {
    const message = this.data.inputValue.trim();
    if (!message) return; // 输入为空则不发送

    // 1. 将用户消息添加到 chatHistory，并清空输入框
    const newHistory = this.data.chatHistory.concat([
      { userType: 'user', content: message }
    ]);
    this.setData({
      chatHistory: newHistory,
      inputValue: ''
    });

    // 2. 模拟 AI 回复
    //   实际开发中，可通过 wx.request 调用后端API或第三方接口
    const aiReply = "AI 回复: " + message;

    // 3. 将 AI 回复添加到 chatHistory
    setTimeout(() => {
      const updatedHistory = this.data.chatHistory.concat([
        { userType: 'ai', content: aiReply }
      ]);
      this.setData({ chatHistory: updatedHistory });
    }, 500); 
  }
});
