# 教育类微信小程序管理后台

## 项目概述

这是一个基于Vue 3 + TypeScript + Element Plus的教育类微信小程序管理后台，用于管理题目、视频等教学资源。

## 技术栈

- **框架**: Vue 3 + TypeScript
- **UI组件库**: Element Plus
- **构建工具**: Vite
- **路由管理**: Vue Router 4
- **状态管理**: Pinia
- **HTTP客户端**: Axios
- **图表库**: ECharts
- **样式**: SCSS

## 项目结构

```
admin-web/
├── src/
│   ├── api/                    # API接口
│   │   ├── request.ts          # 请求封装
│   │   ├── auth.ts             # 认证相关
│   │   ├── questions.ts        # 题目相关
│   │   ├── videos.ts           # 视频相关
│   │   ├── statistics.ts       # 统计相关
│   │   └── upload.ts           # 上传相关
│   ├── components/             # 公共组件
│   ├── layouts/                # 布局组件
│   │   └── MainLayout.vue      # 主布局
│   ├── router/                 # 路由配置
│   │   └── index.ts            # 路由定义
│   ├── stores/                 # 状态管理
│   │   └── user.ts             # 用户状态
│   ├── types/                  # 类型定义
│   │   ├── user.ts             # 用户类型
│   │   ├── question.ts         # 题目类型
│   │   ├── video.ts            # 视频类型
│   │   └── statistics.ts       # 统计类型
│   ├── utils/                  # 工具函数
│   │   ├── auth.ts             # 认证工具
│   │   └── format.ts           # 格式化工具
│   ├── views/                  # 页面组件
│   │   ├── login/              # 登录页
│   │   ├── dashboard/          # 仪表板
│   │   ├── questions/          # 题目管理
│   │   ├── videos/             # 视频管理
│   │   ├── statistics/         # 数据统计
│   │   ├── settings/           # 个人设置
│   │   └── error/              # 错误页面
│   ├── styles/                 # 样式文件
│   │   └── index.scss          # 全局样式
│   ├── App.vue                 # 根组件
│   └── main.ts                 # 入口文件
├── public/                     # 静态资源
├── index.html                  # HTML模板
├── package.json                # 依赖配置
├── vite.config.ts              # Vite配置
├── tsconfig.json               # TypeScript配置
└── README.md                   # 项目说明
```

## 功能特性

### 1. 认证管理
- 管理员登录
- 用户信息管理
- 权限控制
- 自动登录

### 2. 题目管理
- 题目CRUD操作
- 题目分类和搜索
- 批量操作
- 题目类型支持（单选、多选、填空、简答）

### 3. 视频管理
- 视频CRUD操作
- 视频分类和搜索
- 文件上传
- 视频信息管理

### 4. 数据统计
- 仪表板概览
- 题目统计图表
- 视频统计图表
- 用户数据统计

### 5. 系统设置
- 个人资料管理
- 密码修改
- 系统配置

## 环境要求

- Node.js 18+
- npm 或 yarn

## 安装和启动

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3001

### 3. 构建生产版本

```bash
npm run build
```

### 4. 预览生产版本

```bash
npm run preview
```

### 5. 登录账号和密码
```bash
管理员账户（用户名：admin，密码：admin123）
```

## 配置说明

### 1. API配置

在 `src/api/request.ts` 中配置API基础地址：

```typescript
const service = axios.create({
  baseURL: '/api/v1',  // API基础地址
  timeout: 10000,      // 请求超时时间
})
```

### 2. 代理配置

在 `vite.config.ts` 中配置开发代理：

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',  // 后端服务地址
      changeOrigin: true,
    },
  },
}
```

### 3. 环境变量

创建 `.env` 文件配置环境变量：

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_APP_TITLE=教育管理后台
```

## 开发规范

### 1. 代码规范
- 使用TypeScript进行类型检查
- 遵循Vue 3 Composition API规范
- 使用ESLint进行代码检查
- 统一的代码格式化

### 2. 组件规范
- 组件名使用PascalCase
- 组件文件使用.vue扩展名
- 组件props定义类型
- 组件事件使用emit

### 3. API规范
- 统一的请求响应格式
- 错误处理机制
- 请求拦截器
- 响应拦截器

### 4. 样式规范
- 使用SCSS预处理器
- 遵循BEM命名规范
- 响应式设计
- 主题支持

## 页面说明

### 1. 登录页面
- 管理员登录表单
- 表单验证
- 错误提示
- 自动跳转

### 2. 仪表板
- 数据概览卡片
- 统计图表
- 最近活动
- 快速操作

### 3. 题目管理
- 题目列表展示
- 搜索和筛选
- 批量操作
- 题目编辑

### 4. 视频管理
- 视频列表展示
- 文件上传
- 视频信息编辑
- 分类管理

### 5. 数据统计
- 图表展示
- 数据导出
- 趋势分析
- 报表生成

## 组件说明

### 1. 布局组件
- `MainLayout.vue`: 主布局组件
- 侧边栏导航
- 头部工具栏
- 面包屑导航

### 2. 业务组件
- 题目表单组件
- 视频上传组件
- 图表组件
- 搜索组件

### 3. 通用组件
- 加载组件
- 空状态组件
- 确认对话框
- 消息提示

## 状态管理

### 1. 用户状态 (user.ts)
- 用户信息
- 登录状态
- 权限信息
- 登录/登出操作

### 2. 应用状态
- 主题设置
- 语言设置
- 侧边栏状态
- 加载状态

## 路由配置

### 1. 路由结构
- 登录页面
- 主布局页面
- 业务功能页面
- 错误页面

### 2. 路由守卫
- 登录验证
- 权限检查
- 页面标题设置
- 加载状态管理

## 样式主题

### 1. 默认主题
- 蓝色主色调
- 简洁设计
- 响应式布局
- 暗色模式支持

### 2. 自定义主题
- 主题变量配置
- 组件样式覆盖
- 动态主题切换
- 主题持久化

## 性能优化

### 1. 代码分割
- 路由懒加载
- 组件懒加载
- 第三方库分离
- 按需加载

### 2. 资源优化
- 图片压缩
- 字体优化
- CSS压缩
- JS压缩

### 3. 缓存策略
- 接口缓存
- 组件缓存
- 静态资源缓存
- 浏览器缓存

## 部署说明

### 1. 构建配置
```bash
npm run build
```

### 2. 部署到Nginx
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 3. 部署到Docker
```dockerfile
FROM nginx:alpine
COPY dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 常见问题

### 1. 开发环境问题
- 端口占用：修改vite.config.ts中的port配置
- 代理不生效：检查代理配置和网络连接
- 热更新失败：重启开发服务器

### 2. 构建问题
- 类型错误：检查TypeScript配置
- 依赖问题：删除node_modules重新安装
- 内存不足：增加Node.js内存限制

### 3. 部署问题
- 路由404：配置Nginx的try_files
- 接口跨域：配置代理或CORS
- 静态资源404：检查public目录配置

## 版本更新

### v1.0.0 (2025-09-28)
- 初始版本发布
- 基础功能实现
- 管理界面完善

## 许可证

MIT License
