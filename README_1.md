# AI Chat for the Elderly

## 项目简介
AI Chat for the Elderly 是一个面向老年人的微信小程序，旨在通过人工智能技术提供健康用药建议、社区公告、养生推荐、运动提醒等功能，帮助老年人更好地管理日常生活。

该小程序的核心 MVP（Minimum Viable Product）是 AI 互动聊天功能，用户可以通过文本或语音输入获取健康相关信息。后续将引入 LangChain 框架，支持上下文记忆、多轮对话与功能模块整合，构建多 Agent 智能系统。

## 项目结构

```plaintext
AI chat for the elderly/       # 项目根目录
├── project.config.json       # 微信开发者工具的项目配置
├── project.private.config.json  # 私有配置
├── app.js                    # 小程序入口逻辑
├── app.json                  # 全局配置
├── app.wxss                  # 全局样式
├── sitemap.json              # 页面索引配置
│
├── pages/                    # 小程序功能页面
│   ├── index/                # 首页
│   ├── chatAI/               # AI 互动页面
│   ├── community/            # 社区公告页面
│   ├── health_life/          # 健康生活页面
│   ├── nearby/               # 附近场所查询页面
│
├── utils/                    # 工具函数
│   ├── request.js            # 接口封装（支持请求 Flask 后端）
│   ├── constants.js
│   ├── exampleQuestions.js
│
├── images/                   # 图片资源
├── cloudfunctions/chatAI/    # 原微信云函数（可保留兼容）
├── server/                   # Flask + LangChain 后端（新版推荐）
│   ├── app.py                # Flask 启动文件
│   ├── config.py             # API 密钥与设置
│   ├── agent/                # 各 Agent 模块
│   │   ├── chat_agent.py     # 多轮对话 Agent（支持上下文）
│   │   ├── health_agent.py   # 健康建议模块
│   │   └── memory_manager.py # 记忆系统
│   ├── utils/                # 通用工具模块
│   └── requirements.txt      # Python 依赖
├── train/                    # 训练数据与样本（可选）
└── doc/                      # 项目文档
```

## 开发技术栈
### 前端
- 微信小程序原生开发：WXML、WXSS、JavaScript
- 使用 `wx.request` 请求 Flask API 接口（支持多轮上下文）

### 后端
- Node.js 云函数（旧版 MVP 阶段）
- Flask + LangChain（新版推荐）
  - 使用 LangChain 构建多模块 Agent（如健康问答、社区信息、导航查询）
  - 使用 Memory 模块支持多用户上下文记忆

## 核心功能
### 1. AI 互动聊天（升级版）
- 支持上下文多轮对话
- 每位用户拥有独立记忆
- 支持健康咨询、情绪陪伴、提示记录

### 2. 社区公告（待开发）
- 工作人员发布通知，老年人可浏览

### 3. 健康推荐（开发中）
- 养生饮食建议 + 运动提醒（结合微信步数）

### 4. 附近场所查询（待开发）
- 查询医院、公园、药店等
- 结合地图 API 提供导航

## 部署与运行

### 1. 运行小程序前端
```sh
1. 安装微信开发者工具
2. git clone <repository-url>
3. 打开微信开发者工具并导入项目
4. 运行并调试
```

### 2. 运行后端（Flask + LangChain）
```sh
cd server/
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

### 3. 配置小程序前端连接 Flask 接口
- 修改 `utils/request.js` 中接口地址：
```js
url: 'https://your-flask-server.com/chat'
```

## 未来规划
### 短期目标（1-3个月）
- 多轮上下文记忆支持
- 健康问答 Agent 模块优化
- 支持语音输入

### 中期目标（4-6个月）
- 引入更多模块：社区公告、生活助手、位置查询
- 各 Agent 独立开发、按需组合

### 长期目标（6-12个月）
- 个性化健康建议推荐系统
- 聊天记录分析与陪伴模型研究

## 贡献指南
欢迎贡献代码和建议！
1. Fork 本项目
2. 创建新分支 `feature/xxx`
3. 完善功能后提交 Pull Request

---

本 README 文档将根据项目进展持续更新。

