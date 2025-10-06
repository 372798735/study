# 教育学习小程序

> 基于微信小程序原生框架开发的在线教育学习平台

## 📖 项目简介

这是一个教育学习小程序，用户可以通过微信小程序进行在线学习、刷题练习和观看视频课程。小程序提供题目练习、视频学习、学习记录等功能，帮助学生随时随地进行学习。

## ✨ 主要功能

### 1. 首页 (index)
- 📊 学习数据总览
- 🎯 快速入口导航
- 📚 推荐学习内容
- 🔥 热门课程展示

### 2. 题目练习 (questions)
- **题目列表** (`questions/list`)
  - 按分类筛选题目（数学、语文、英语等）
  - 按难度筛选（简单、中等、困难）
  - 题目搜索功能
  
- **题目详情** (`questions/detail`)
  - 题目内容展示
  - 选项选择
  - 答案提交
  - 答案解析
  - 视频讲解（如果有）

### 3. 视频学习 (videos)
- **视频列表** (`videos/list`)
  - 按分类浏览视频
  - 视频搜索
  - 学习进度展示
  
- **视频播放器** (`videos/player`)
  - 视频播放
  - 进度记录
  - 倍速播放
  - 全屏播放

### 4. 个人中心 (profile)
- 👤 用户信息展示
- 📈 学习统计数据
- 📝 学习记录查看
- ⚙️ 个人设置

## 🛠️ 技术栈

- **框架**：微信小程序原生框架
- **编译**：ES6+
- **样式**：WXSS + PostCSS
- **后端接口**：NestJS (RESTful API)
- **数据库**：MySQL + Prisma ORM

## 📦 前置要求

在开始之前，请确保你已经安装：

1. **微信开发者工具**
   - 下载地址：https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html
   - 版本要求：最新稳定版

2. **微信开发者账号**
   - 注册地址：https://mp.weixin.qq.com/
   - 需要获取 AppID（测试号也可以）

3. **后端服务**
   - 确保后端服务已启动（参见 `../server/README.md`）
   - 默认地址：`http://localhost:3000`

## 🚀 快速开始

### 1. 下载代码

```bash
# 克隆项目（如果还没有）
git clone <repository-url>

# 进入小程序目录
cd miniprogram
```

### 2. 配置 AppID

打开 `project.config.json` 文件，修改 `appid` 字段：

```json
{
  "appid": "你的小程序AppID"
}
```

> 如果没有 AppID，可以使用测试号，在微信开发者工具中会自动分配。

### 3. 启动后端服务

在启动小程序之前，确保后端服务已经运行：

```bash
cd ../server
npm install
npm run start:dev
```

后端服务地址：`http://localhost:3000`

### 4. 打开微信开发者工具

1. 启动微信开发者工具
2. 选择「导入项目」
3. 项目目录选择：`miniprogram` 文件夹
4. 项目名称：自定义
5. AppID：输入你的 AppID 或选择测试号
6. 点击「确定」

### 5. 预览和调试

- **模拟器预览**：在开发者工具中直接预览
- **真机预览**：点击「预览」，扫码在手机微信中查看
- **真机调试**：点击「真机调试」，扫码进行调试

## ⚙️ 配置说明

### API 基础地址配置

如果你的后端服务地址不是 `http://localhost:3000`，需要修改 API 配置：

在 `utils/request.js` 或相关配置文件中修改：

```javascript
const BASE_URL = 'http://your-backend-url:port/api/v1'
```

### 开发环境配置

在 `project.private.config.json` 中可以配置开发相关选项：

```json
{
  "setting": {
    "urlCheck": false,  // 开发时建议关闭 URL 校验
    "compileHotReLoad": true  // 启用热重载
  }
}
```

> ⚠️ **注意**：关闭 URL 校验仅用于开发环境，上线前务必开启！

## 📁 目录结构

```
miniprogram/
├── pages/                      # 页面目录
│   ├── index/                 # 首页
│   │   ├── index.wxml        # 页面结构
│   │   ├── index.wxss        # 页面样式
│   │   ├── index.js          # 页面逻辑
│   │   └── index.json        # 页面配置
│   ├── questions/            # 题目模块
│   │   ├── list/            # 题目列表
│   │   └── detail/          # 题目详情
│   ├── videos/              # 视频模块
│   │   ├── list/           # 视频列表
│   │   └── player/         # 视频播放器
│   └── profile/            # 个人中心
├── utils/                   # 工具函数
│   ├── request.js          # 网络请求封装
│   ├── auth.js             # 微信登录授权
│   └── util.js             # 通用工具函数
├── components/             # 自定义组件
├── images/                 # 图片资源
├── app.js                  # 小程序入口文件
├── app.json                # 全局配置
├── app.wxss                # 全局样式
├── project.config.json     # 项目配置
└── README.md              # 说明文档
```

## 🔑 微信登录对接

小程序使用微信授权登录，流程如下：

1. **获取微信用户信息**
```javascript
wx.login({
  success: (res) => {
    // 发送 res.code 到后端
    // 后端返回自定义登录态 token
  }
})
```

2. **后端接口**
   - 登录接口：`POST /api/v1/auth/wechat-login`
   - 请求参数：`{ code: "微信登录code" }`
   - 返回数据：`{ token: "JWT Token", userInfo: {...} }`

3. **存储 Token**
```javascript
wx.setStorageSync('token', token)
```

4. **请求携带 Token**
```javascript
wx.request({
  url: 'API_URL',
  header: {
    'Authorization': `Bearer ${token}`
  }
})
```

## 📝 API 接口文档

详细的 API 接口文档请查看后端项目：`../server/README.md`

主要接口：

| 功能 | 接口地址 | 方法 | 说明 |
|------|---------|------|------|
| 微信登录 | `/auth/wechat-login` | POST | 微信登录 |
| 题目列表 | `/questions` | GET | 获取题目列表 |
| 题目详情 | `/questions/:id` | GET | 获取题目详情 |
| 提交答案 | `/questions/:id/answer` | POST | 提交答题 |
| 视频列表 | `/videos` | GET | 获取视频列表 |
| 视频详情 | `/videos/:id` | GET | 获取视频详情 |
| 更新进度 | `/videos/:id/progress` | POST | 更新学习进度 |
| 学习记录 | `/statistics/learning-records` | GET | 获取学习记录 |

## 🎨 组件库

建议使用以下组件库提升开发效率：

- **Vant Weapp**：有赞UI组件库（推荐）
  - 文档：https://vant-contrib.gitee.io/vant-weapp/
  
```bash
# 安装 Vant Weapp
npm init
npm install @vant/weapp -S --production

# 构建 npm
在微信开发者工具中：工具 -> 构建 npm
```

## 🐛 常见问题

### 1. 无法请求后端接口

**问题**：`request:fail url not in domain list`

**解决方案**：
1. 开发时：在 `project.private.config.json` 中设置 `"urlCheck": false`
2. 正式环境：在微信公众平台配置服务器域名

### 2. 微信登录失败

**问题**：`errcode: 40029`

**解决方案**：
- 检查 AppID 是否正确
- 确保后端配置了正确的微信 AppSecret
- 查看后端 `.env` 文件中的 `WECHAT_APPID` 和 `WECHAT_SECRET`

### 3. 视频无法播放

**问题**：视频地址访问被拒绝

**解决方案**：
- 检查阿里云 OSS Bucket 权限设置为「公共读」
- 在微信公众平台配置视频域名白名单
- 确保视频 URL 是 HTTPS 协议

### 4. 真机预览样式错乱

**解决方案**：
- 使用 `rpx` 单位而不是 `px`
- 避免使用 `calc()` 等不兼容的 CSS 函数
- 测试不同手机尺寸的适配

### 5. 开发者工具编译报错

**解决方案**：
- 清除缓存：详情 -> 本地设置 -> 清除缓存
- 重启微信开发者工具
- 检查 `project.config.json` 配置是否正确

## 🔒 权限配置

小程序需要以下权限：

在 `app.json` 中配置：

```json
{
  "permission": {
    "scope.userLocation": {
      "desc": "你的位置信息将用于小程序位置接口的效果展示"
    }
  }
}
```

## 📱 上线发布

### 1. 准备工作

- [ ] 修改所有 API 地址为正式环境
- [ ] 开启 URL 校验 (`urlCheck: true`)
- [ ] 在微信公众平台配置所有域名
- [ ] 配置隐私政策和用户协议

### 2. 上传代码

1. 在微信开发者工具中点击「上传」
2. 填写版本号和项目备注
3. 上传成功后在微信公众平台查看

### 3. 提交审核

1. 登录微信公众平台
2. 进入「版本管理」
3. 提交审核并填写审核信息
4. 等待审核结果（一般1-3天）

### 4. 发布上线

审核通过后，在微信公众平台点击「发布」即可上线。

## 📈 性能优化建议

1. **图片优化**
   - 使用 WebP 格式
   - 图片压缩
   - 使用 CDN

2. **分包加载**
```json
{
  "subpackages": [
    {
      "root": "pages/questions",
      "pages": ["list/list", "detail/detail"]
    }
  ]
}
```

3. **数据缓存**
   - 使用 `wx.setStorage` 缓存常用数据
   - 避免重复请求

4. **骨架屏**
   - 使用加载占位符提升用户体验

## 🤝 开发团队

如有问题，请联系开发团队或提交 Issue。

## 📄 许可证

[MIT License](../LICENSE)

---

## 📚 相关文档

- [微信小程序官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- [后端服务文档](../server/README.md)
- [管理后台文档](../admin-web/README.md)
- [项目需求文档](../docs/需求文档.md)
- [技术方案文档](../docs/技术方案.md)

---

**祝你开发愉快！ 🎉**

