const cloud = require('wx-server-sdk');
cloud.init();

const { handleTextMessage } = require('./textHandler');
const { handleVoice } = require('./voiceHandler');

exports.main = async (event, context) => {
  console.log("收到请求:", event);

  try {
    const { message, history = [], audioFile, previousAudioId } = event;

    // ✅ 语音输入优先处理
    if (audioFile) {
      console.log("进入语音处理流程");
      const result = await handleVoice(audioFile, previousAudioId);
      console.log("语音处理结果:", result);
      return result;
    }

    // ✅ 无文本消息时提示错误
    if (!message || typeof message !== 'string') {
      console.error("错误: 消息不能为空");
      return { code: 400, message: "消息不能为空" };
    }

    // ✅ 文字处理逻辑
    console.log("进入文本处理流程，用户输入:", message);
    const htmlResponse = await handleTextMessage(message, history);

    return {
      code: 200,
      message: "请求成功",
      data: htmlResponse
    };

  } catch (error) {
    console.error("服务器错误:", error);
    return {
      code: 500,
      message: "服务器错误",
      error: error.message
    };
  }
};
