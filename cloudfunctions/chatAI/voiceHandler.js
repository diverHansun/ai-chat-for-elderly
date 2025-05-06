// voiceHandler.js
const cloud = require("wx-server-sdk");
const axios = require("axios");




// 新增：处理语音文件，将语音转为文本后再调用 AI 接口
// 使用 GLM-4-Voice 接口直接处理语音
let previousAudioId = null; // 临时缓存上一次 AI 的 audio.id，可替换为持久化方案（如数据库）

async function processAudio(audioFileID, previousAudioIdFromClient) {
  const API_KEY = "c75e1f4d6a8e4dc3b3641eb8aef02319.qNVgpDVyfu5Qn98U";
  const VOICE_API_URL = "https://open.bigmodel.cn/api/paas/v4/chat/completions";

  try {
    // 获取音频临时链接
    const wxRes = await cloud.getTempFileURL({
      fileList: [audioFileID],
    });
    const tempUrl = wxRes.fileList[0].tempFileURL;

    // 下载音频转 base64
    const axiosRes = await axios.get(tempUrl, { responseType: "arraybuffer" });
    const audioBase64 = Buffer.from(axiosRes.data).toString("base64");

    // 构建 messages（多轮对话：系统提示 + 上一轮 assistant 回复 + 本次 user 输入）
    const messages = [
      {
        role: "system",
        content: "你是一个精通医疗、老年人生活保健知识的AI医生，擅长为老年用户提供通俗易懂的健康建议和问诊答复。请用平易近人、易于理解的口吻，同时兼顾科学和专业性。"
      }
    ];

    // 如果有上一轮 audioId，则先加入上一轮 assistant 的回复
    const previousId = previousAudioIdFromClient || previousAudioId;
    if (previousId) {
      messages.push({
        role: "assistant",
        audio: { id: previousId }
      });
    }

    // 当前轮用户输入
    messages.push({
      role: "user",
      content: [
        {
          type: "input_audio",
          input_audio: {
            data: audioBase64,
            format: "mp3" // 或 "wav"，与你上传的格式一致
          }
        }
      ]
    });

    // 发送请求
    const response = await axios.post(
      VOICE_API_URL,
      {
        model: "glm-4-voice",
        messages: messages,
        stream: false,
        max_tokens: 1024
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("GLM-4-Voice 原始响应:", response.data);

    const aiText = response.data.choices?.[0]?.message?.content || "";
    const audioReplyBase64 = response.data.choices?.[0]?.message?.audio?.data;
    const audioReplyId = response.data.choices?.[0]?.message?.audio?.id;
    if (!audioReplyBase64) throw new Error("没有返回语音内容");

    // 更新缓存 audio.id，用于下一轮
    previousAudioId = audioReplyId;

    return {
      code: 200,
      audioBase64: audioReplyBase64,
      text: aiText || "(未识别出有效内容)",
      audioId: audioReplyId // 返回给前端
    };

  } catch (error) {
    console.error("语音处理失败:", error.response?.data || error);
    return { code: 500, message: "语音处理失败", error: error.message };
  }
}