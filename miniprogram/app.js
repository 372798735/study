// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync("logs") || [];
    logs.unshift(Date.now());
    wx.setStorageSync("logs", logs);

    // 检查登录状态
    this.checkLoginStatus();
  },

  onShow() {
    console.log("小程序显示");
    // 每次显示时检查登录状态
    this.checkLoginStatus();
  },

  onHide() {
    console.log("小程序隐藏");
  },

  // 检查登录状态
  checkLoginStatus() {
    const token = wx.getStorageSync("token");
    const userInfo = wx.getStorageSync("userInfo");

    if (token && userInfo) {
      // 已登录，更新全局数据
      this.globalData.token = token;
      this.globalData.userInfo = userInfo;
      console.log("已登录:", userInfo);
    } else {
      // 未登录，清空全局数据
      this.globalData.token = null;
      this.globalData.userInfo = null;
      console.log("未登录");

      // 获取当前页面栈
      const pages = getCurrentPages();
      if (pages.length > 0) {
        const currentPage = pages[pages.length - 1];
        // 如果当前不是登录页，则跳转到登录页
        if (currentPage.route !== "pages/login/login") {
          wx.reLaunch({
            url: "/pages/login/login",
          });
        }
      }
    }
  },

  // 退出登录
  logout() {
    wx.removeStorageSync("token");
    wx.removeStorageSync("userInfo");
    this.globalData.token = null;
    this.globalData.userInfo = null;
    wx.reLaunch({
      url: "/pages/login/login",
    });
  },

  // 获取用户信息
  getUserInfo() {
    return this.globalData.userInfo;
  },

  // 获取token
  getToken() {
    return this.globalData.token || wx.getStorageSync("token");
  },

  globalData: {
    userInfo: null,
    token: null,
    apiBaseUrl: "http://192.168.1.2:3000/api/v1",
  },
});
