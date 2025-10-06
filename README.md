# 📚 教育学习平台

> 基于微信小程序的在线教育学习系统，包含小程序端、管理后台和后端服务

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)
![NestJS](https://img.shields.io/badge/NestJS-10+-red.svg)
![Vue](https://img.shields.io/badge/Vue-3.0+-brightgreen.svg)
![MySQL](https://img.shields.io/badge/MySQL-8.0+-blue.svg)
![WeChat](https://img.shields.io/badge/WeChat-MiniProgram-brightgreen.svg)

</div>

## 🎯 项目概述

这是一个完整的在线教育学习平台，采用前后端分离架构，包含三个子系统：

| 系统 | 技术栈 | 说明 | 端口 |
|------|--------|------|------|
| 🎓 **微信小程序** | 原生框架 | 学生学习端 | - |
| 🖥️ **管理后台** | Vue 3 + Element Plus | 教师管理端 | 5173 |
| ⚙️ **后端服务** | NestJS + Prisma | API 服务 | 3000 |

### 核心功能

- ✅ **题目练习**：单选题、多选题、判断题，支持分类和难度筛选
- 🎬 **视频学习**：在线视频课程，支持进度记录和倍速播放
- 📊 **学习统计**：学习时长、答题正确率、学习进度等数据分析
- 👤 **用户管理**：微信登录、用户信息管理
- 🔐 **权限控制**：JWT 认证、角色权限管理
- ☁️ **文件存储**：阿里云 OSS 文件存储

## 📦 项目结构

```
study/
├── miniprogram/              # 微信小程序端
│   ├── pages/               # 页面
│   │   ├── index/          # 首页
│   │   ├── questions/      # 题目模块
│   │   ├── videos/         # 视频模块
│   │   └── profile/        # 个人中心
│   ├── utils/              # 工具函数
│   ├── app.js              # 入口文件
│   └── README.md           # 小程序说明文档
│
├── admin-web/               # PC 管理后台（Vue 3）
│   ├── src/
│   │   ├── api/            # API 接口
│   │   ├── views/          # 页面视图
│   │   ├── components/     # 组件
│   │   ├── router/         # 路由
│   │   ├── stores/         # 状态管理
│   │   └── utils/          # 工具函数
│   └── README.md           # 后台说明文档
│
├── server/                  # 后端服务（NestJS）
│   ├── src/
│   │   ├── modules/        # 功能模块
│   │   │   ├── auth/      # 认证模块
│   │   │   ├── questions/ # 题目模块
│   │   │   ├── videos/    # 视频模块
│   │   │   ├── users/     # 用户模块
│   │   │   ├── statistics/# 统计模块
│   │   │   └── upload/    # 上传模块
│   │   ├── prisma/        # Prisma ORM
│   │   └── main.ts        # 入口文件
│   ├── prisma/
│   │   └── schema.prisma  # 数据库模型
│   └── README.md          # 服务端说明文档
│
├── docs/                   # 项目文档
│   ├── 需求文档.md
│   └── 技术方案.md
│
└── README.md              # 项目总览（本文件）
```

## 🛠️ 技术栈

### 微信小程序端
- **框架**：微信小程序原生框架
- **UI**：原生组件 + Vant Weapp（可选）
- **网络**：wx.request
- **存储**：wx.storage

### PC 管理后台
- **框架**：Vue 3 + TypeScript
- **构建**：Vite 5
- **UI 组件**：Element Plus
- **状态管理**：Pinia
- **路由**：Vue Router 4
- **HTTP 客户端**：Axios
- **代码规范**：ESLint + Prettier

### 后端服务
- **框架**：NestJS 10 + TypeScript
- **数据库**：MySQL 8.0
- **ORM**：Prisma
- **认证**：JWT + Passport
- **文件存储**：阿里云 OSS / 本地存储
- **文档**：Swagger / OpenAPI

## 🚀 快速开始

### 前置要求

确保你的开发环境已安装：

- [Node.js](https://nodejs.org/) 18+
- [MySQL](https://www.mysql.com/) 8.0+
- [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
- [Git](https://git-scm.com/)

### 1️⃣ 克隆项目

```bash
git clone <repository-url>
cd study
```

### 2️⃣ 启动后端服务

```bash
# 进入服务端目录
cd server

# 安装依赖
npm install

# 配置环境变量
cp env.example .env
# 编辑 .env 文件，配置数据库和其他环境变量

# 运行数据库迁移
npx prisma migrate dev

# 初始化种子数据
npm run db:seed

# 启动开发服务器
npm run start:dev
```

服务启动后，访问：
- API 服务：http://localhost:3000
- API 文档：http://localhost:3000/api/docs

### 3️⃣ 启动管理后台

```bash
# 打开新终端，进入管理后台目录
cd admin-web

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问：http://localhost:5173

默认管理员账号：
- 用户名：`admin`
- 密码：`admin123`

### 4️⃣ 启动微信小程序

1. 打开微信开发者工具
2. 选择「导入项目」
3. 项目目录选择：`miniprogram` 文件夹
4. AppID：使用测试号或填写你的小程序 AppID
5. 点击「确定」开始开发

详细说明：[miniprogram/README.md](./miniprogram/README.md)

## 📖 详细文档

| 文档 | 说明 |
|------|------|
| [服务端文档](./server/README.md) | 后端 API 开发文档 |
| [管理后台文档](./admin-web/README.md) | 前端管理系统文档 |
| [小程序文档](./miniprogram/README.md) | 微信小程序开发文档 |
| [需求文档](./docs/需求文档.md) | 项目需求说明 |
| [技术方案](./docs/技术方案.md) | 技术架构设计 |

## 🗄️ 数据库设计

主要数据表：

- `users` - 用户表（小程序用户）
- `admins` - 管理员表
- `questions` - 题目表
- `videos` - 视频表
- `learning_records` - 学习记录表

详细的数据库模型请查看：[server/prisma/schema.prisma](./server/prisma/schema.prisma)

## 🔐 环境配置

### 后端环境变量 (server/.env)

```env
# 数据库配置
DATABASE_URL="mysql://root:password@localhost:3306/education_db"

# JWT 配置
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"

# 微信小程序配置
WECHAT_APPID="your-wechat-appid"
WECHAT_SECRET="your-wechat-secret"

# 阿里云 OSS 配置（可选）
ALIYUN_ACCESS_KEY_ID="your-access-key-id"
ALIYUN_ACCESS_KEY_SECRET="your-access-key-secret"
ALIYUN_OSS_BUCKET="your-bucket-name"
ALIYUN_OSS_REGION="oss-cn-shenzhen"

# 服务配置
PORT=3000
BASE_URL="http://localhost:3000"
```

### 前端环境变量 (admin-web/.env)

```env
# API 基础地址
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

## 🌟 功能特性

### 管理后台功能

- ✅ **仪表板**：数据概览、快速统计
- 📝 **题目管理**：CRUD 操作、批量导入、视频讲解
- 🎬 **视频管理**：视频上传、编辑、删除、分类管理
- 📊 **数据统计**：学习数据分析、图表展示
- ⚙️ **系统设置**：个人信息、密码修改

### 小程序功能

- 🏠 **首页**：学习概览、快速入口
- 📚 **题目练习**：分类筛选、答题记录、答案解析
- 🎥 **视频学习**：在线播放、进度记录
- 👤 **个人中心**：学习统计、历史记录

## 🐛 常见问题

### 1. 数据库连接失败

**错误**：`Can't connect to MySQL server`

**解决**：
- 检查 MySQL 服务是否启动
- 确认 `.env` 文件中的数据库配置正确
- 确保数据库已创建：`CREATE DATABASE education_db;`

### 2. 端口被占用

**错误**：`Port 3000 is already in use`

**解决**：
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

### 3. 小程序无法请求接口

**解决**：
- 开发时在 `project.private.config.json` 中设置 `"urlCheck": false`
- 正式环境需在微信公众平台配置服务器域名

### 4. OSS 上传失败

**解决**：
- 检查 OSS 配置是否正确
- 确保 Bucket 权限设置为「公共读」
- 在微信公众平台配置 OSS 域名白名单

## 📈 开发进度

- [x] 项目架构搭建
- [x] 后端 API 开发
- [x] 管理后台开发
- [x] 数据库设计与迁移
- [x] 文件上传（OSS 集成）
- [ ] 小程序功能开发
- [ ] 单元测试编写
- [ ] 性能优化
- [ ] 部署上线

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建新分支：`git checkout -b feature/your-feature`
3. 提交更改：`git commit -am 'Add some feature'`
4. 推送分支：`git push origin feature/your-feature`
5. 提交 Pull Request

## 📝 版本历史

- **v1.0.0** (2025-10-06)
  - 初始版本发布
  - 完成基础功能开发

## 📄 许可证

本项目采用 [MIT](LICENSE) 许可证。

## 👥 联系我们

如有任何问题或建议，欢迎联系：

- 📧 Email: your-email@example.com
- 💬 Issues: [GitHub Issues](https://github.com/your-repo/issues)

---

<div align="center">

**⭐️ 如果这个项目对你有帮助，请给一个 Star ⭐️**

Made with ❤️ by Development Team

</div>
