# 教育类微信小程序后端服务

## 项目概述

这是一个基于NestJS的教育类微信小程序后端服务，提供题目管理、视频管理、用户管理等功能。

## 技术栈

- **框架**: NestJS (Node.js)
- **数据库**: MySQL 8.0
- **ORM**: Prisma
- **认证**: JWT + Passport
- **文档**: Swagger
- **验证**: class-validator + class-transformer
- **文件上传**: Multer

## 项目结构

```
server/
├── src/
│   ├── modules/               # 功能模块
│   │   ├── auth/             # 认证模块
│   │   ├── questions/        # 题目管理
│   │   ├── videos/           # 视频管理
│   │   ├── users/            # 用户管理
│   │   ├── statistics/       # 数据统计
│   │   └── upload/           # 文件上传
│   ├── prisma/               # 数据库相关
│   │   ├── schema.prisma     # 数据库模式
│   │   └── prisma.service.ts # Prisma服务
│   ├── app.module.ts         # 应用模块
│   ├── app.controller.ts     # 应用控制器
│   ├── app.service.ts        # 应用服务
│   └── main.ts               # 应用入口
├── prisma/                   # Prisma配置
│   └── schema.prisma         # 数据库模式
├── uploads/                  # 上传文件存储
├── package.json              # 依赖配置
├── tsconfig.json             # TypeScript配置
├── nest-cli.json             # NestJS配置
└── env.example               # 环境变量示例
```

## 环境要求

- Node.js 18+
- MySQL 8.0
- npm 或 yarn

## 安装和启动

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `env.example` 文件为 `.env` 并修改配置：

```bash
cp env.example .env
```

编辑 `.env` 文件：

```env
# 数据库配置
DATABASE_URL="mysql://root:root@localhost:3306/education_db"

# JWT(JSON Web Token)配置  - 用于签名和验证JWT令牌的秘钥 就是生成token
JWT_SECRET="your-jwt-secret-key"   // 秘钥 生产环境设置得复杂一些
JWT_EXPIRES_IN="7d"  // 令牌过期时间 7d = 7天  1h = 1小时  30m = 30分钟 3600 = 3600秒

# 文件上传配置
UPLOAD_PATH="./uploads"
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES="image/jpeg,image/png,image/gif,video/mp4,video/avi,video/mov"

# 服务器配置
PORT=3000
NODE_ENV="development"
```

### 3. 数据库初始化

```bash
# 生成Prisma客户端
npm run prisma:generate

# 运行数据库迁移
npm run prisma:migrate

# 可选：向数据库填充初始数据，方便开发和测试
npm run prisma:seed
```

### 4. 启动服务

```bash
# 开发模式
npm run start:dev

# 生产模式
npm run build
npm run start:prod
```

## API文档

启动服务后，访问以下地址查看API文档：

- Swagger文档: http://localhost:3000/api/docs
- 健康检查: http://localhost:3000/api/v1/health

## 主要功能

### 1. 认证模块 (Auth)
- 管理员登录
- 微信小程序登录
- JWT Token管理
- 用户信息获取

### 2. 题目管理 (Questions)
- 题目CRUD操作
- 题目分类和搜索
- 答题功能
- 答案解析

### 3. 视频管理 (Videos)
- 视频CRUD操作
- 视频分类和搜索
- 观看进度跟踪
- 视频信息管理

### 4. 用户管理 (Users)
- 用户信息管理
- 学习记录查询
- 学习统计

### 5. 数据统计 (Statistics)
- 仪表板数据
- 题目统计
- 视频统计
- 用户统计

### 6. 文件上传 (Upload)
- 图片上传
- 视频上传
- 文件类型验证
- 文件大小限制

## 数据库设计

### 主要表结构

1. **users** - 用户表
2. **questions** - 题目表
3. **videos** - 视频表
4. **learning_records** - 学习记录表
5. **admins** - 管理员表

### 关系说明

- 用户与学习记录：一对多
- 题目与学习记录：一对多
- 视频与学习记录：一对多

## 配置说明

### 1. 数据库配置

在 `.env` 文件中配置数据库连接：

```env
DATABASE_URL="mysql://username:password@localhost:3306/education_db"
```

### 2. JWT配置

```env
JWT_SECRET="your-jwt-secret-key"
JWT_EXPIRES_IN="7d"
```

### 3. 文件上传配置

```env
UPLOAD_PATH="./uploads"
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES="image/jpeg,image/png,image/gif,video/mp4,video/avi,video/mov"
```

### 4. 微信小程序配置

```env
WECHAT_APP_ID="your-wechat-app-id"
WECHAT_APP_SECRET="your-wechat-app-secret"
```

## 开发规范

### 1. 代码规范
- 使用TypeScript
- 遵循NestJS最佳实践
- 使用装饰器进行验证
- 统一的错误处理

### 2. API设计
- RESTful API设计
- 统一的响应格式
- 适当的HTTP状态码
- 完整的API文档

### 3. 数据库操作
- 使用Prisma ORM
- 适当的索引设计
- 数据验证和约束
- 事务处理

## 部署说明

### 1. 生产环境配置

```env
NODE_ENV="production"
PORT=3000
DATABASE_URL="mysql://username:password@your-db-host:3306/education_db"
```

### 2. 使用PM2部署

```bash
# 安装PM2
npm install -g pm2

# 构建项目
npm run build

# 启动应用
pm2 start dist/main.js --name education-server

# 查看状态
pm2 status

# 查看日志
pm2 logs education-server
```

### 3. 使用Docker部署

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main.js"]
```

## 监控和日志

### 1. 健康检查

```bash
curl http://localhost:3000/api/v1/health
```

### 2. 日志管理

使用PM2进行日志管理：

```bash
# 查看实时日志
pm2 logs education-server

# 查看错误日志
pm2 logs education-server --err

# 清空日志
pm2 flush education-server
```

## 常见问题

### 1. 数据库连接失败
- 检查数据库服务是否启动
- 检查连接字符串是否正确
- 检查网络连接

### 2. JWT Token无效
- 检查JWT_SECRET配置
- 检查Token是否过期
- 检查请求头格式

### 3. 文件上传失败
- 检查上传目录权限
- 检查文件大小限制
- 检查文件类型限制

## 版本更新

### v1.0.0 (2025-09-28)
- 初始版本发布
- 基础功能实现
- API文档完善

## 许可证

MIT License
