"""
chat_service.py
封装调用智谱AI GLM-4 接口的聊天逻辑

参考文档: https://open.bigmodel.cn/dev/api/normal-model/glm-4#language
"""
import requests

class ChatService:
    def __init__(self):
        # 请在智谱AI后台获取你的 API Key，并将下面的 YOUR_ZHIPU_API_KEY 替换为真实的值
        self.api_key = "bdc56e9dcca242a6bc1b3934b07c14fe.4L58AvMizol67EQv"  
        # GLM-4 接口地址，根据文档此处填写正确的 URL
        self.model_url = "https://open.bigmodel.cn/dev/api/normal-model/glm-4"

    def get_ai_response(self, user_message: str) -> str:
        """
        根据用户输入调用智谱AI GLM-4 接口，返回生成的回复
        根据文档示例，设置请求参数：prompt、temperature、max_tokens、top_p、language
        """
        headers = {
            "Content-Type": "application/json",
            # 按照文档说明，Authorization 需要 Bearer 前缀
            "Authorization": f"Bearer {self.api_key}"
        }
        # 构造请求体，根据官方说明传递相应参数
        payload = {
            "prompt": user_message,
            "temperature": 0.7,
            "max_tokens": 512,
            "top_p": 0.9,
            "language": "zh"  # 根据文档设置语言为中文
        }

        try:
            response = requests.post(
                self.model_url,
                headers=headers,
                json=payload,
                timeout=30  # 超时时间可根据需要调整
            )
            if response.status_code == 200:
                res_json = response.json()
                # 根据文档说明，智谱AI接口返回格式可能类似于：
                # {
                #    "data": {
                #         "text": "模型生成的回复内容"
                #    },
                #    "status": "success"
                # }
                if "data" in res_json and "text" in res_json["data"]:
                    return res_json["data"]["text"]
                else:
                    return "无法解析智谱AI回复，请检查返回格式。"
            else:
                return f"调用智谱AI接口失败: {response.status_code} {response.text}"
        except Exception as e:
            return f"调用智谱AI接口异常: {str(e)}"
