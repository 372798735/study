// pages/service/service.js
Page({
  data: {},

  onLoad(options) {
    console.log("客服页面加载");
  },

  // 处理客服会话消息
  handleContact(e) {
    console.log("客服消息", e.detail);

    // 用户点击了客服会话按钮
    if (e.detail.path) {
      wx.showToast({
        title: "已进入客服会话",
        icon: "success",
      });
    }
  },

  // 跳转到题目列表
  goToQuestions() {
    wx.navigateTo({
      url: "/pages/questions/list/list",
    });
  },

  // 跳转到视频列表
  goToVideos() {
    wx.navigateTo({
      url: "/pages/videos/list/list",
    });
  },

  // 跳转到个人中心
  goToProfile() {
    wx.switchTab({
      url: "/pages/profile/profile",
    });
  },

  onShareAppMessage() {
    return {
      title: "在线客服 - 学习平台",
      path: "/pages/service/service",
    };
  },
});
