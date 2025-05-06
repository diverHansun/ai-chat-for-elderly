const axios = require("axios");
const marked = require("marked");
const readline = require("readline");

exports.main = async (event, context) => {
  console.log("收到请求:", event);

  try {
    const { message } = event;
    if (!message) {
      console.error("错误: 消息不能为空");
      return { code: 400, message: "消息不能为空" };
    }

    console.log("用户输入:", message);

    // 调用通义千问 API，使用流式输出
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

// 使用通义千问 API 实现流式输出，参考文档：https://help.aliyun.com/zh/model-studio/user-guide/streaming
async function getAIResponse(userMessage) {
  const API_KEY = "sk-119583b2139043ed847b6915abccda99"; // 请替换成你的 API Key
  const API_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions"; // 确认 API 地址是否正确

  return new Promise((resolve, reject) => {
    axios.post(
      API_URL,
      {
        model: "qwen-plus", // 根据需要选择具体的通义千问模型（例如 "qwen-chat"）
        messages: [
          {
            role: "system",
            content:
              "你是一个精通医疗、老年人生活保健知识的AI医生，面向老年人问诊和健康建议，请用通俗易懂、平易近人的方式回答问题，同时兼顾科学和专业性。"
          },
          { role: "user", content: userMessage }
        ],
        temperature: 0.8,
        max_tokens: 512,
        top_p: 0.9,
        stream: false // 开启流式输出
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
        },
        responseType: "stream" // 设置为流式响应
      }
    )
    .then(response => {
      const rl = readline.createInterface({
        input: response.data,
        crlfDelay: Infinity
      });

      let fullResponse = "";

      rl.on("line", (line) => {
        if (line.startsWith("data:")) {
          const dataStr = line.slice(5).trim();
          if (dataStr === "[DONE]") {
            rl.close();
            return;
          }
          try {
            const parsed = JSON.parse(dataStr);
            // 根据返回格式从每个 chunk 中提取增量文本
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              fullResponse += content;
            }
          } catch (err) {
            console.error("解析 JSON 错误:", err, "原始行:", line);
          }
        }
      });

      rl.on("close", () => {
        console.log("流式输出结束");
        resolve(fullResponse);
      });

      rl.on("error", (err) => {
        console.error("流式输出错误:", err);
        reject("AI 服务暂时不可用，请稍后再试");
      });
    })
    .catch((error) => {
      console.error("调用 AI 失败:", error);
      reject("AI 服务暂时不可用，请稍后再试");
    });
  });
}
