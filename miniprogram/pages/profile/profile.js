// pages/profile/profile.js
const app = getApp();

Page({
  data: {
    userInfo: {
      avatarUrl: "",
      nickName: "未登录",
      isLogin: false,
    },
    stats: {
      studyDays: 0,
      questionCount: 0,
      videoCount: 0,
      score: 0,
    },
    menuList: [
      // {
      //   id: 1,
      //   icon: "📚",
      //   title: "我的收藏",
      //   desc: "查看收藏的题目和视频",
      //   path: "",
      // },
      // {
      //   id: 2,
      //   icon: "📝",
      //   title: "学习记录",
      //   desc: "查看学习历史",
      //   path: "",
      // },
      // {
      //   id: 3,
      //   icon: "📊",
      //   title: "学习统计",
      //   desc: "查看详细学习数据",
      //   path: "",
      // },
      // {
      //   id: 4,
      //   icon: "⚙️",
      //   title: "设置",
      //   desc: "个人设置和偏好",
      //   path: "",
      // },
      // {
      //   id: 5,
      //   icon: "❓",
      //   title: "帮助与反馈",
      //   desc: "使用帮助和问题反馈",
      //   path: "",
      // },
      {
        id: 6,
        icon: "ℹ️",
        title: "关于我们",
        desc: "了解更多信息",
        path: "",
      },
    ],
  },

  onLoad() {
    console.log("=== 我的页面加载 ===");
    this.checkLoginStatus();
    this.loadUserStats();
  },

  // 阻止事件冒泡
  stopPropagation() {
    // 阻止事件冒泡到父元素
  },

  onShow() {
    // 每次显示页面时刷新数据
    this.checkLoginStatus();
    this.loadUserStats();
  },

  // 检查登录状态
  checkLoginStatus() {
    const token = wx.getStorageSync("token");
    const userInfo = wx.getStorageSync("userInfo");

    if (token && userInfo) {
      this.setData({
        "userInfo.isLogin": true,
        "userInfo.nickName": userInfo.nickname || userInfo.nickName || "用户",
        "userInfo.avatarUrl": userInfo.avatar || userInfo.avatarUrl || "",
      });
    } else {
      this.setData({
        "userInfo.isLogin": false,
        "userInfo.nickName": "未登录",
        "userInfo.avatarUrl": "",
      });
    }
  },

  // 加载用户统计数据
  loadUserStats() {
    const token = wx.getStorageSync("token");
    if (!token) {
      // 未登录时显示默认数据
      this.setData({
        stats: {
          studyDays: 0,
          questionCount: 0,
          videoCount: 0,
          score: 0,
        },
      });
      return;
    }

    // 调用后端API获取统计数据
    wx.request({
      url: `${app.globalData.apiBaseUrl}/statistics/user`,
      header: {
        Authorization: `Bearer ${token}`,
      },
      success: (res) => {
        console.log("用户统计数据返回:", res);

        if (res.statusCode === 200 && res.data.code === 200) {
          this.setData({
            stats: res.data.data || this.data.stats,
          });
        }
      },
      fail: (err) => {
        console.error("加载统计数据失败:", err);
      },
    });
  },

  // 点击头像/用户信息区域 - 登录或查看个人信息
  onUserInfoTap() {
    if (!this.data.userInfo.isLogin) {
      // 未登录，显示登录选项
      this.showLoginOptions();
    } else {
      // 已登录，查看个人信息
      wx.showToast({
        title: "个人信息功能开发中",
        icon: "none",
      });
    }
  },

  // 显示登录选项
  showLoginOptions() {
    wx.showModal({
      title: "选择登录方式",
      content: "快速登录：无需后端，立即体验\n完整登录：连接后端，数据同步",
      confirmText: "快速登录",
      cancelText: "完整登录",
      success: (res) => {
        if (res.confirm) {
          // 快速登录（不需要后端）
          this.quickLogin();
        } else if (res.cancel) {
          // 完整登录（需要后端）
          this.handleLogin();
        }
      },
    });
  },

  // 快速登录（无需后端，用于开发测试）
  quickLogin() {
    wx.showModal({
      title: "快速登录",
      content: "请先点击头像选择图片，然后编辑昵称，最后点击确定完成登录",
      confirmText: "知道了",
      success: () => {
        // 模拟登录成功
        const mockToken = "quick_login_" + Date.now();
        const userInfo = {
          nickName: this.data.userInfo.nickName || "微信用户",
          avatarUrl: this.data.userInfo.avatarUrl || "",
        };

        // 保存到本地
        wx.setStorageSync("token", mockToken);
        wx.setStorageSync("userInfo", userInfo);

        this.setData({
          "userInfo.isLogin": true,
        });

        wx.showToast({
          title: "快速登录成功",
          icon: "success",
        });

        // 加载模拟统计数据
        this.loadMockStats();
      },
    });
  },

  // 加载模拟统计数据（快速登录使用）
  loadMockStats() {
    this.setData({
      stats: {
        studyDays: Math.floor(Math.random() * 30) + 1,
        questionCount: Math.floor(Math.random() * 100) + 10,
        videoCount: Math.floor(Math.random() * 50) + 5,
        score: Math.floor(Math.random() * 2000) + 500,
      },
    });
  },

  // 获取微信头像
  onChooseAvatar(e) {
    console.log("选择头像:", e.detail);
    const { avatarUrl } = e.detail;

    this.setData({
      "userInfo.avatarUrl": avatarUrl,
    });

    // 如果已登录，保存到本地存储
    const token = wx.getStorageSync("token");
    if (token) {
      const userInfo = wx.getStorageSync("userInfo") || {};
      userInfo.avatarUrl = avatarUrl;
      wx.setStorageSync("userInfo", userInfo);
    }

    wx.showToast({
      title: "头像已更新",
      icon: "success",
      duration: 1500,
    });
  },

  // 获取微信昵称
  onNicknameInput(e) {
    console.log("输入昵称:", e.detail);
    const nickName = e.detail.value;

    if (!nickName || nickName.trim() === "") {
      wx.showToast({
        title: "昵称不能为空",
        icon: "none",
      });
      return;
    }

    this.setData({
      "userInfo.nickName": nickName,
    });

    // 如果已登录，保存到本地存储
    const token = wx.getStorageSync("token");
    if (token) {
      const userInfo = wx.getStorageSync("userInfo") || {};
      userInfo.nickName = nickName;
      wx.setStorageSync("userInfo", userInfo);

      wx.showToast({
        title: "昵称已更新",
        icon: "success",
        duration: 1500,
      });
    }
  },

  // 处理登录（完整登录，需要后端）
  handleLogin() {
    wx.showModal({
      title: "完整登录",
      content: "需要连接后端服务器进行登录，请确保后端服务正常运行",
      confirmText: "继续",
      cancelText: "取消",
      success: (res) => {
        if (res.confirm) {
          // 执行登录逻辑
          this.doLogin();
        }
      },
    });
  },

  // 执行登录（完整登录）
  doLogin() {
    // 检查后端服务
    wx.showLoading({ title: "检查服务..." });

    // 先测试后端是否可用
    wx.request({
      url: `${app.globalData.apiBaseUrl}/questions?page=1&limit=1`,
      timeout: 3000,
      success: (testRes) => {
        console.log("后端服务测试:", testRes);
        if (testRes.statusCode === 200) {
          // 后端可用，继续登录
          this.performLogin();
        } else {
          wx.hideLoading();
          this.showBackendError();
        }
      },
      fail: (err) => {
        console.error("后端服务不可用:", err);
        wx.hideLoading();
        this.showBackendError();
      },
    });
  },

  // 后端不可用提示
  showBackendError() {
    wx.showModal({
      title: "后端服务未启动",
      content:
        "无法连接到后端服务器，请检查：\n1. 后端服务是否运行\n2. API地址是否正确\n\n是否使用快速登录？",
      confirmText: "快速登录",
      cancelText: "取消",
      success: (res) => {
        if (res.confirm) {
          this.quickLogin();
        }
      },
    });
  },

  // 执行微信登录
  performLogin() {
    wx.showLoading({ title: "登录中..." });

    wx.login({
      success: (loginRes) => {
        console.log("wx.login 成功:", loginRes);
        if (loginRes.code) {
          // 调用后端登录接口
          wx.request({
            url: `${app.globalData.apiBaseUrl}/auth/wechat-login`,
            method: "POST",
            data: {
              code: loginRes.code,
            },
            success: (res) => {
              console.log("后端登录返回:", res);

              if (res.statusCode === 200 && res.data.code === 200) {
                const { token, user } = res.data.data;

                // 保存 token 和用户信息
                wx.setStorageSync("token", token);
                wx.setStorageSync("userInfo", user);

                this.setData({
                  "userInfo.isLogin": true,
                  "userInfo.nickName": user.nickName || "微信用户",
                  "userInfo.avatarUrl": user.avatarUrl || "",
                });

                wx.showToast({
                  title: "登录成功",
                  icon: "success",
                });

                // 刷新统计数据
                this.loadUserStats();
              } else {
                console.error("登录失败:", res.data);
                wx.showModal({
                  title: "登录失败",
                  content:
                    res.data.message || "后端返回错误，是否使用快速登录？",
                  confirmText: "快速登录",
                  cancelText: "取消",
                  success: (modalRes) => {
                    if (modalRes.confirm) {
                      this.quickLogin();
                    }
                  },
                });
              }
            },
            fail: (err) => {
              console.error("登录请求失败:", err);
              wx.showModal({
                title: "网络错误",
                content: "无法连接到服务器，是否使用快速登录？",
                confirmText: "快速登录",
                cancelText: "取消",
                success: (modalRes) => {
                  if (modalRes.confirm) {
                    this.quickLogin();
                  }
                },
              });
            },
            complete: () => {
              wx.hideLoading();
            },
          });
        } else {
          wx.hideLoading();
          wx.showToast({
            title: "获取登录凭证失败",
            icon: "none",
          });
        }
      },
      fail: (err) => {
        wx.hideLoading();
        console.error("微信登录失败:", err);
        wx.showToast({
          title: "微信登录失败",
          icon: "none",
        });
      },
    });
  },

  // 点击菜单项
  onMenuTap(e) {
    const { id, title } = e.currentTarget.dataset;

    // 检查是否需要登录
    if (!this.data.userInfo.isLogin && id !== 5 && id !== 6) {
      wx.showModal({
        title: "提示",
        content: "该功能需要登录后使用",
        confirmText: "去登录",
        success: (res) => {
          if (res.confirm) {
            this.handleLogin();
          }
        },
      });
      return;
    }

    // 功能跳转或提示
    wx.showToast({
      title: `${title}功能开发中`,
      icon: "none",
    });
  },

  // 退出登录
  handleLogout() {
    wx.showModal({
      title: "退出登录",
      content: "确定要退出登录吗？",
      confirmText: "确定",
      confirmColor: "#f56c6c",
      success: (res) => {
        if (res.confirm) {
          // 清除本地存储
          wx.removeStorageSync("token");
          wx.removeStorageSync("userInfo");

          // 调用全局退出方法
          if (app.logout) {
            app.logout();
          }

          wx.showToast({
            title: "已退出登录",
            icon: "success",
            duration: 1500,
          });

          // 跳转到登录页
          setTimeout(() => {
            wx.reLaunch({
              url: "/pages/login/login",
            });
          }, 1500);
        }
      },
    });
  },
});
