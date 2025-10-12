// pages/login/login.js
const app = getApp();

Page({
  data: {
    phone: "",
    password: "",
    loading: false,
  },

  onPhoneInput(e) {
    this.setData({ phone: e.detail.value });
  },

  onPasswordInput(e) {
    this.setData({ password: e.detail.value });
  },

  async handleLogin() {
    const { phone, password } = this.data;

    // 验证手机号
    if (!phone) {
      wx.showToast({ title: "请输入手机号", icon: "none" });
      return;
    }

    if (!/^1[3-9]\d{9}$/.test(phone)) {
      wx.showToast({ title: "手机号格式不正确", icon: "none" });
      return;
    }

    // 验证密码
    if (!password) {
      wx.showToast({ title: "请输入密码", icon: "none" });
      return;
    }

    if (password.length < 6) {
      wx.showToast({ title: "密码至少6位", icon: "none" });
      return;
    }

    this.setData({ loading: true });

    // 调用登录API
    wx.request({
      url: `${app.globalData.apiBaseUrl}/users/login`,
      method: "POST",
      data: { phone, password },
      header: {
        "Content-Type": "application/json",
      },
      success: (res) => {
        console.log("登录响应:", res);

        if (res.statusCode === 201 && res.data.code === 200) {
          const { token, user } = res.data.data;

          // 保存 token 和用户信息
          wx.setStorageSync("token", token);
          wx.setStorageSync("userInfo", user);

          // 更新全局数据
          app.globalData.token = token;
          app.globalData.userInfo = user;

          wx.showToast({
            title: "登录成功",
            icon: "success",
            duration: 1500,
          });

          // 延迟跳转，让用户看到成功提示
          setTimeout(() => {
            wx.reLaunch({ url: "/pages/index/index" });
          }, 1500);
        } else {
          wx.showToast({
            title: res.data?.message || "登录失败",
            icon: "none",
          });
        }
      },
      fail: (err) => {
        console.error("登录请求失败:", err);
        wx.showToast({
          title: "网络错误，请稍后重试",
          icon: "none",
        });
      },
      complete: () => {
        this.setData({ loading: false });
      },
    });
  },
});
