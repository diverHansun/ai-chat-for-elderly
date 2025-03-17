const axios = require("axios");
const marked = require("marked");

exports.main = async (event, context) => {
  console.log("收到请求:", event);

  try {
    const { message } = event;
    if (!message) {
      console.error("错误: 消息不能为空");
      return { code: 400, message: "消息不能为空" };
    }

    console.log("用户输入:", message);

    // 调用 AI 接口
    const aiResponse = await getAIResponse(message);

    console.log("AI 回复(原文Markdown):", aiResponse);

    // 将 Markdown 格式转换为 HTML
    const htmlResponse = marked.parse(aiResponse);
    console.log("AI 回复(HTML 结果):", htmlResponse);


    return {
      code: 200,
      message: "请求成功",
      data: htmlResponse
    };
  } catch (error) {
    console.error("服务器错误:", error);
    return { code: 500, message: "服务器错误", error: error.message };
  }
};

// 发送请求到智谱 AI
async function getAIResponse(userMessage) {
  const API_KEY = "77d92def89524349897858bf12f550f1.akrFZdjzdtXzkJvo"; // ⚠️ 请替换成你的 API Key
  const API_URL = "https://open.bigmodel.cn/api/paas/v4/chat/completions"; // 确保是最新的 API 地址

  try {
    const response = await axios.post(
      API_URL,
      {
        model: "glm-4-Plus",  // ⚠️ 确保是支持的模型
        messages: [ { role: "system", content: "你是一个精通医疗，老年人生活保健知识，面向老年人问诊和健康建议的AI医生 ，请结合相关知识通俗易懂地回答用户(尤其是老年用户)的问题。尽可能用平易近人，易于理解的口吻回答，同时也要兼顾科学专业的回答" }, // 🔥 设定 AI 角色
        { role: "user", content: userMessage }],  // V4 版本需要使用 messages 数组
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
