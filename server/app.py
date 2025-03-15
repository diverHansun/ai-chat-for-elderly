"""
app.py
Flask 主入口：启动服务器并定义接口

本示例定义 /ping 测试接口和 /api/chat 聊天接口，后者将用户消息传递给 ChatService 处理。
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
from chat_service import ChatService

app = Flask(__name__)
CORS(app)  # 允许跨域访问（便于小程序调用）

# 实例化 ChatService
chat_service = ChatService()

@app.route('/ping', methods=['GET'])
def ping():
    """
    测试接口：GET /ping
    用于验证服务器是否正常运行
    """
    return jsonify({"message": "Flask API is running!"})

@app.route('/api/chat', methods=['POST'])
def chat():
    """
    聊天接口：POST /api/chat
    接收 JSON 格式的 {"message": "..."}，返回 AI 生成的回复
    """
    data = request.json
    if not data or 'message' not in data:
        return jsonify({"code": 400, "message": "消息不能为空"}), 400

    user_message = data['message'].strip()
    if not user_message:
        return jsonify({"code": 400, "message": "消息不能为空"}), 400

    # 调用 ChatService 获取 AI 回复
    ai_response = chat_service.get_ai_response(user_message)

    return jsonify({
        "code": 200,
        "message": "请求成功",
        "data": ai_response
    }), 200

if __name__ == '__main__':
    # 启动服务器，监听所有网卡，端口5000
    app.run(host='0.0.0.0', port=5000, debug=True)
