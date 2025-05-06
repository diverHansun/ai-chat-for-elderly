// textHandler.js
const axios = require("axios");
const marked = require("marked");

async function getAIResponse(userMessage, conversationHistory = []) {
    const API_KEY = "77d92def89524349897858bf12f550f1.akrFZdjzdtXzkJvo"; // 请替换成你的 API Key
    const API_URL = "https://open.bigmodel.cn/api/paas/v4/chat/completions"; // 最新的 API 地址
  
    // 如果没有历史对话，则先添加默认系统消息
    if (conversationHistory.length === 0) {
      conversationHistory.push({
        role: "system",
        content: "你是一个精通医疗，老年人生活保健知识，面向老年人问诊和健康建议的AI医生，请结合相关知识通俗易懂地回答用户（尤其是老年用户）的问题。尽可能用平易近人、易于理解的口吻回答，同时也要兼顾科学专业的回答。"
      });
    }
    // 将当前用户消息加入历史
    conversationHistory.push({ role: "user", content: userMessage });
  
    try {
      const response = await axios.post(
        API_URL,
        {
          model: "glm-4-Plus", // 确保是支持的模型
          messages: conversationHistory, // 传入完整的对话历史
          temperature: 0.8,
          max_tokens: 512,
          top_p: 0.9
        },
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json"
          }
        }
      );
  
      console.log("API 响应:", response.data);
  
      // 检查是否成功返回内容
      if (!response.data || !response.data.choices || response.data.choices.length === 0) {
        console.error("API 返回的数据无效:", response.data);
        return "AI 服务错误: 响应数据无效";
      }
  
      return response.data.choices[0].message.content || "AI 无法生成回复";
    } catch (error) {
  
      console.error("调用 AI 失败:", error);
      return "AI 服务暂时不可用，请稍后再试";
    }
  };