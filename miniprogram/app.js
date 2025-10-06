// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync("logs") || [];
    logs.unshift(Date.now());
    wx.setStorageSync("logs", logs);

    // 登录
    this.login();
  },

  onShow() {
    console.log("小程序显示");
  },

  onHide() {
    console.log("小程序隐藏");
  },

  // 微信登录
  login() {
    wx.login({
      success: (res) => {
        console.log("登录成功，code:", res.code);
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        // 调用后端接口: POST /api/v1/auth/wechat-login
        // this.getUserInfo()
      },
      fail: (err) => {
        console.error("登录失败:", err);
      },
    });
  },

  // 获取用户信息
  getUserInfo() {
    wx.getUserProfile({
      desc: "用于完善用户资料",
      success: (res) => {
        console.log("用户信息:", res.userInfo);
        this.globalData.userInfo = res.userInfo;
      },
      fail: (err) => {
        console.error("获取用户信息失败:", err);
      },
    });
  },

  globalData: {
    userInfo: null,
    token: null,
    apiBaseUrl: "http://localhost:3000/api/v1",
  },
});
