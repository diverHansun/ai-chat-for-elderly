# AI Chat for the Elderly

## 项目简介
AI Chat for the Elderly 是一个面向老年人的微信小程序，旨在通过人工智能技术提供健康用药建议、社区公告、养生推荐、运动提醒等功能，帮助老年人更好地管理日常生活。

该小程序的核心 MVP（Minimum Viable Product） 是 AI 互动聊天功能，用户可以通过文本或语音输入获取健康相关信息。此外，未来计划扩展功能，包括社区公告、附近场所查询、养生文章推荐等。

## 项目结构

```plaintext
AI chat for the elderly/       # 小程序根目录
├── project.config.json       # 微信开发者工具的项目配置
├── project.private.config.json  # 微信开发者工具的私有配置
├── app.js                    # 小程序入口逻辑
├── app.json                  # 小程序全局配置（路由、tabBar等）
├── app.wxss                  # 小程序全局样式
├── sitemap.json              # 配置小程序及其页面是否允许被微信索引
│
├── pages/                    # 小程序功能页面
│   ├── index/                # 主页示例
│   │   ├── index.wxml
│   │   ├── index.wxss
│   │   ├── index.js
│   │   ├── index.json
│   ├── chatAI/               # AI 互动页面
│   │   ├── chatAI.wxml
│   │   ├── chatAI.wxss
│   │   ├── chatAI.js
│   │   ├── chatAI.json
│   ├── community/            # 社区公告页面
│   │   ├── community.wxml
│   │   ├── community.wxss
│   │   ├── community.js
│   │   ├── community.json
│   ├── health_life/         # 健康生活页面（合并健康推荐和运动提醒）
│   │   ├── health_life.wxml
│   │   ├── health_life.wxss
│   │   ├── health_life.js
│   │   ├── health_life.json
│   ├── nearby/              # 附近场所查询页面
│   │   ├── nearby.wxml
│   │   ├── nearby.wxss
│   │   ├── nearby.js
│   │   ├── nearby.json
│
├── utils/                    # 工具函数或公用模块
│   ├── request.js            # 封装 wx.request，统一接口调用
│   ├── constants.js          # 定义常量、枚举等
│   ├── exampleQuestions.js   # 
│
├── images/                   # 图片资源（如图标、背景等）
├── cloudfunctions/chatAI/    # 微信云函数（AI 互动逻辑）
├── server/                   # 服务器端代码（待开发）
├── train/                    # chatAI训练数据（待开发）
└── doc/                      # 文档相关
```

## 开发技术栈
### 前端
- **微信小程序原生开发**：使用 WXML、WXSS、JavaScript 构建页面
- **API 调用**：封装 `wx.request` 进行接口请求

### 后端
- **当前阶段**：微信云函数（Cloud Functions），用于 AI 互动功能
- **未来规划**：
  - **Flask 或 Spring Boot** 作为后端框架，部署在微信云托管上
  - 提供社区公告、附近场所查询、养生文章推荐等功能

## 核心功能
### 1. AI 互动聊天（当前 MVP）
- 文字输入交互
- 语音输入交互（后期集成）
- AI 处理健康用药等问题

### 2. 社区公告（待开发）
- 社区工作者发布通知
- 老年人可浏览社区信息

### 3. 健康推荐（待开发）
- 统一健康相关功能，包括健康推荐（饮食建议）+ 运动提醒（步数追踪）
- 根据微信步数提供运动建议

### 4. 附近场所查询（待开发）
- 提供老年人常用场所（医院、药店、公园等）信息
- 允许用户查询 3000m 内的公园、学校、菜市场等。
- 结合百度/高德地图 API，提供导航路线。

## 部署与运行
### 1. 运行前端小程序
1. 安装 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
2. 克隆项目
   ```sh
   git clone <repository-url>
   ```
3. 在微信开发者工具中打开项目
4. 预览并调试小程序

### 2. 运行后端（当前使用微信云函数）
1. 进入 `cloudfunctions/chatAI` 目录
2. 部署云函数
   ```sh
   wx cloud functions deploy --name chatAI
   ```
3. 在小程序前端调用云函数测试

## 未来规划
- **短期目标（1-3个月）**
  - 完善 AI 互动功能，提高响应精准度
  - 增加语音输入功能

- **中期目标（4-6个月）**
  - 结合 Flask 或 Spring Boot 进行后端升级
  - 增加社区公告、健康推荐等功能

- **长期目标（6-12个月）**
  - 结合 AI 进行个性化健康建议
  - 优化小程序用户体验

## 贡献指南
欢迎贡献代码和建议！
1. Fork 本项目
2. 创建新分支 `feature/xxx`
3. 讨论并审核后提交代码并发起 Pull Request


---

本 README 文档将根据项目进展不断更新，以保持最新的开发状态和功能描述。

