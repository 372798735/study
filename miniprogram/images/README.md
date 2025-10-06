# 📱 小程序图片资源目录

## 目录结构

```
images/
├── tabbar/              # 底部导航栏图标
│   ├── icon-generator.html   # 🎨 图标生成器（推荐使用）
│   ├── 使用说明.txt          # 快速使用指南
│   ├── 图标获取指南.md       # 详细获取方式
│   └── README.md             # 说明文档
└── README.md            # 本文件
```

## 🚀 快速开始

### 添加 TabBar 图标（3步完成）

#### 第1步：生成图标
双击打开 `tabbar/icon-generator.html` 文件，在浏览器中打开

#### 第2步：下载图标
点击页面上的"一键下载全部图标"按钮，下载 8 个 PNG 文件

#### 第3步：放置图标
将下载的 8 个文件放入 `images/tabbar/` 文件夹

#### 完成！
重启微信开发者工具，底部导航栏将显示图标

---

## 📋 需要的图标文件

| 文件名 | 说明 | 尺寸 | 颜色 |
|--------|------|------|------|
| `home.png` | 首页-未选中 | 81×81 | #7A7E83 |
| `home-active.png` | 首页-选中 | 81×81 | #409EFF |
| `question.png` | 题目-未选中 | 81×81 | #7A7E83 |
| `question-active.png` | 题目-选中 | 81×81 | #409EFF |
| `video.png` | 视频-未选中 | 81×81 | #7A7E83 |
| `video-active.png` | 视频-选中 | 81×81 | #409EFF |
| `profile.png` | 我的-未选中 | 81×81 | #7A7E83 |
| `profile-active.png` | 我的-选中 | 81×81 | #409EFF |

---

## 🎯 其他获取图标的方式

如果你不想使用生成器，也可以：

1. **从 iconfont 下载** - 访问 https://www.iconfont.cn/
2. **从 Icons8 下载** - 访问 https://icons8.com/
3. **从 Flaticon 下载** - 访问 https://www.flaticon.com/
4. **使用设计工具制作** - Figma、Sketch、Photoshop

详细说明请查看：`tabbar/图标获取指南.md`

---

## ⚙️ 配置说明

图标路径已在 `app.json` 中配置完成：

```json
{
  "tabBar": {
    "list": [
      {
        "pagePath": "pages/index/index",
        "text": "首页",
        "iconPath": "images/tabbar/home.png",
        "selectedIconPath": "images/tabbar/home-active.png"
      },
      // ... 其他配置
    ]
  }
}
```

---

## ❓ 常见问题

### Q: 没有图标文件会怎样？
A: 微信开发者工具会显示默认占位符，功能正常使用，只是看不到自定义图标。

### Q: 图标不显示？
A: 请检查：
1. 文件名是否正确（区分大小写）
2. 文件是否在正确的文件夹
3. 文件格式是否为 PNG
4. 是否重启了开发者工具

### Q: 可以用 JPG 或 SVG 吗？
A: 不可以，微信小程序 TabBar 只支持 PNG 格式。

### Q: 图标太大或太小？
A: 建议使用 81×81 像素，文件大小不超过 40KB。

---

## 💡 建议

- **开发测试阶段**：使用 `icon-generator.html` 快速生成简单图标
- **正式上线前**：使用专业设计的图标（iconfont 或设计师制作）
- **保持一致性**：所有图标使用统一的设计风格

---

## 📞 需要帮助？

如遇到问题，请查看：
- `tabbar/使用说明.txt` - 快速参考
- `tabbar/图标获取指南.md` - 详细教程

