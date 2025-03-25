const questionPool = require('../../utils/exampleQuestions.js');
const recorderManager = wx.getRecorderManager();
const innerAudioContext = wx.createInnerAudioContext();
Page({
  data: {
    inputValue: "",
    chatHistory: [],
    toView: "", // 用于 scroll-into-view 定位最新消息

    // 1. 欢迎卡片显示标识
    showWelcomeCards: true, // 是否显示欢迎区

    // 2. 示例问题
    exampleQuestions: [], // 随机抽取的 4 个问题
    loading: false,
    recording: false // 录音状态标识
  },


  onLoad() {
    wx.cloud.init();
    // 从外部引入的问题库中随机抽取4个问题
    const random4 = this.getRandomQuestions(questionPool, 4);
    this.setData({
      exampleQuestions: random4
    });
    // 监听录音结束事件
    recorderManager.onStop((res) => {
      console.log("录音完成，临时路径:", res.tempFilePath);
      this.uploadAudio(res.tempFilePath);
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
  
    if (this.data.showWelcomeCards) {
      this.setData({ showWelcomeCards: false });
    }
    if (this.data.exampleQuestions) {
      this.setData({ exampleQuestions: false });
    }
  
    const userAvatar = "/pages/chatAI/images/user.png";
    const aiAvatar = "/pages/chatAI/images/ai.png";
  
    // 用户发言加入历史
    const newHistory = this.data.chatHistory.concat([
      { userType: "user", content: message, avatar: userAvatar }
    ]);
    this.setData({
      chatHistory: newHistory,
      inputValue: "",
      toView: "msg" + (newHistory.length - 1),
      loading: true
    });
  
    // 🔁 构建多轮对话上下文
    const historyMessages = this.data.chatHistory.map(item => ({
      role: item.userType === "user" ? "user" : "assistant",
      content: item.content
    }));
    historyMessages.push({ role: "user", content: message });
  
    // 云函数调用，传入 message 和完整上下文
    wx.cloud.callFunction({
      name: "chatAI",
      data: {
        message,
        history: historyMessages
      },
      success: (res) => {
        console.log("云函数返回:", res);
        if (res.result && res.result.code === 200) {
          const aiReplyHtml = res.result.data;
          const updatedHistory = this.data.chatHistory.concat([
            { userType: "ai", content: aiReplyHtml, avatar: aiAvatar }
          ]);
          this.setData({
            chatHistory: updatedHistory,
            toView: "msg" + (updatedHistory.length - 1),
            loading: false
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
  },
  

  // 新增：开始录音（优化：增加异常捕获）
  startRecording() {
    if (this.data.recording) {
      wx.showToast({ title: "正在录音中...", icon: "none" });
      return;
    }
    try {
      wx.showToast({ title: "开始录音...", icon: "none" });
      this.setData({ recording: true });
      recorderManager.start({
        format: "mp3",
        duration: 20000 // 最长10秒
      });
      console.log("录音开始");
    } catch (error) {
      console.error("开始录音失败：", error);
      wx.showToast({ title: "录音失败，请重试", icon: "none" });
      this.setData({ recording: false });
    }
  },

  // 新增：结束录音（优化：增加异常捕获）
  stopRecording() {
    if (this.data.recording) {
      try {
        wx.showToast({ title: "录音结束", icon: "none" });
        this.setData({ recording: false });
        recorderManager.stop();
        console.log("录音结束");
      } catch (error) {
        console.error("结束录音失败：", error);
        wx.showToast({ title: "结束录音失败", icon: "none" });
      }
    }
  },

  // 新增：上传录音文件（优化：增加成功、失败提示）
  uploadAudio(tempFilePath) {
    wx.cloud.uploadFile({
      cloudPath: `audio/${Date.now()}.mp3`,
      filePath: tempFilePath,
      success: (res) => {
        console.log("音频上传成功:", res.fileID);
        wx.showToast({ title: "音频上传成功", icon: "success" });
        this.sendVoiceMessage(res.fileID);
      },
      fail: (err) => {
        console.error("音频上传失败:", err);
        wx.showToast({ title: "音频上传失败", icon: "none" });
      }
    });
  },

// 新增：调用云函数发送语音消息（优化：增加异常捕获）
sendVoiceMessage(fileID) { 
  const userAvatar = "/pages/chatAI/images/user.png";
  const aiAvatar = "/pages/chatAI/images/ai.png";

  if (this.data.showWelcomeCards) this.setData({ showWelcomeCards: false });
  if (this.data.exampleQuestions) this.setData({ exampleQuestions: false });

  const newHistory = this.data.chatHistory.concat([
    { userType: "user", content: "[语音消息]", avatar: userAvatar }
  ]);
  this.setData({
    chatHistory: newHistory,
    toView: "msg" + (newHistory.length - 1),
    loading: true
  });
  
  // 调用云函数获取 AI 语音回复
  wx.cloud.callFunction({
    name: "chatAI",
    data: {
      audioFile: fileID,
      previousAudioId: this.data.previousAudioId || null
    },
    success: (res) => {
      console.log("AI 语音返回:", res);
      
      // 只有在结果有效时才更新 previousAudioId
      if (res.result && res.result.audioId) {
        this.setData({ previousAudioId: res.result.audioId });
      }

      if (res.result && res.result.code === 200 && res.result.audioBase64) {
        const base64Audio = res.result.audioBase64;
        const aiText = res.result.text || "[AI 无回复文本]";

        if (!base64Audio || base64Audio.length < 100) {
          wx.showToast({ title: "语音内容为空", icon: "none" });
          this.setData({ loading: false });
          return;
        }

        // 先移除之前的事件监听，避免重复绑定
        innerAudioContext.offPlay();
        innerAudioContext.offError();

        const arrayBuffer = wx.base64ToArrayBuffer(base64Audio);
        const fs = wx.getFileSystemManager();
        const filePath = `${wx.env.USER_DATA_PATH}/temp_audio.mp3`;

        fs.writeFile({
          filePath,
          data: arrayBuffer,
          encoding: 'binary',
          success: () => {
            innerAudioContext.src = filePath;
            innerAudioContext.play();
          },
          fail: (err) => {
            console.error("写文件失败:", err);
            wx.showToast({ title: "语音播放失败", icon: "none" });
          }
        });

        innerAudioContext.onPlay(() => {
          console.log("AI 回复播放中...");
        });
        innerAudioContext.onError((res) => {
          console.error("播放错误:", res.errMsg);
        });

        const updatedHistory = this.data.chatHistory.concat([
          { userType: "ai", content: aiText, avatar: aiAvatar }
        ]);
        
        this.setData({
          chatHistory: updatedHistory,
          toView: "msg" + (updatedHistory.length - 1),
          loading: false
        });
      } else {
        console.error("AI 语音解析失败:", res.result);
        wx.showToast({ title: "语音解析失败", icon: "none" });
        this.setData({ loading: false });
      }
    },
    fail: (err) => {
      console.error("调用 AI 语音失败:", err);
      wx.showToast({ title: "调用 AI 语音失败", icon: "none" });
      this.setData({ loading: false });
    }
  });
}
});
