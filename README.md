# 教育类微信小程序项目

## 项目概述

这是一个教育类微信小程序系统，包含三个端：
- **微信小程序端**：面向学生的学习练习平台
- **服务端**：基于NestJS的API服务
- **PC管理后台**：面向老师的资源管理平台

## 项目结构

```
education-miniprogram/
├── miniprogram/          # 微信小程序端
├── server/               # 服务端 (NestJS)
├── admin-web/            # PC管理后台 (Vue3)
├── docs/                 # 项目文档
└── README.md             # 项目说明
```

## 技术栈

### 微信小程序端
- 微信小程序原生开发
- WeUI 组件库
- 微信小程序云开发

### 服务端
- Node.js 18+
- NestJS (TypeScript)
- MySQL 8.0
- Prisma ORM
- JWT 认证

### PC管理后台
- Vue 3 + TypeScript
- Element Plus UI组件库
- Vite 构建工具
- Pinia 状态管理

## 快速开始

### 环境要求
- Node.js 18+
- MySQL 8.0
- 微信开发者工具

### 安装依赖
```bash
# 安装服务端依赖
cd server
npm install

# 安装管理后台依赖
cd ../admin-web
npm install

# 安装小程序依赖（如果需要）
cd ../miniprogram
npm install
```

### 启动项目

1. **启动服务端**
```bash
cd server
npm run start:dev
```

2. **启动管理后台**
```bash
cd admin-web
npm run dev
```

3. **启动小程序**
- 使用微信开发者工具打开 `miniprogram` 目录

## 详细文档

- [服务端文档](./server/README.md)
- [管理后台文档](./admin-web/README.md)
- [小程序文档](./miniprogram/README.md)
- [需求文档](./docs/需求文档.md)
- [技术方案](./docs/技术方案.md)

## 开发计划

- [x] 项目结构搭建
- [ ] 服务端API开发
- [ ] 小程序功能开发
- [ ] 管理后台开发
- [ ] 功能测试和联调
- [ ] 部署上线

## 许可证

MIT License
