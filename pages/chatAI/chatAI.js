const questionPool = require('../../utils/exampleQuestions.js');
Page({
  data: {
    inputValue: "",
    chatHistory: [],
    toView: "" ,// 用于 scroll-into-view 定位最新消息

        // 1. 欢迎卡片显示标识
        showWelcomeCards: true,// 是否显示欢迎区

        // 2. 示例问题
        exampleQuestions: [], // 随机抽取的 4 个问题
        loading:false
  },

  onLoad() {
    wx.cloud.init();
    // 从外部引入的问题库中随机抽取4个问题
    const random4 = this.getRandomQuestions(questionPool, 4);
    this.setData({
      exampleQuestions: random4
    });
  },

  // 自定义函数：从数组中随机抽取 count 个不重复元素
  getRandomQuestions(all, count) {
    const shuffled = all.slice(0);
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
      return shuffled.slice(0, count);
  },


  // 点击卡片时，可自动填充输入框
  handleCardTap(e) {
    const question = e.currentTarget.dataset.question || "";
       this.setData({
        inputValue: question
      });
    },

  handleInput(e) {
    this.setData({
      inputValue: e.detail.value
    });
  },

  sendMessage() {
    const message = this.data.inputValue.trim();
    if (!message) return;
    
    // 如果还在显示欢迎卡片，发送消息后隐藏它
    if (this.data.showWelcomeCards) {
      this.setData({ showWelcomeCards: false });
    }
    if (this.data.exampleQuestions) {
      this.setData({ exampleQuestions: false });
    }
    const userAvatar = "/pages/chatAI/images/user.png";
    const aiAvatar = "/pages/chatAI/images/ai.png";

    // 1. 用户消息入队
    const newHistory = this.data.chatHistory.concat([
      { userType: "user", content: message, avatar: userAvatar }
    ]);
    this.setData({
      chatHistory: newHistory,
      inputValue: "",
      toView: "msg" + (newHistory.length - 1), // 滚动到最新用户消息
      loading:true
    });

    // 2. 调用云函数获取 AI 回复
    wx.cloud.callFunction({
      name: "chatAI",
      data: { message },
      success: (res) => {
        console.log("云函数返回:", res);
        if (res.result && res.result.code === 200) {
          // 3. AI 返回 HTML 内容
          const aiReplyHtml = res.result.data;
          const updatedHistory = this.data.chatHistory.concat([
            { userType: "ai", content: aiReplyHtml, avatar: aiAvatar }
          ]);
          this.setData({
            chatHistory: updatedHistory,
            toView: "msg" + (updatedHistory.length - 1), // 滚动到最新 AI 消息
            loading: false // 隐藏“正在生成中...”
          });
        } else {
          console.error("云函数返回错误:", res.result);
          this.setData({ loading: false });
        }
      },
      fail: (err) => {
        console.error("调用云函数失败:", err);
        this.setData({ loading: false });
      }
    });
  }
});
