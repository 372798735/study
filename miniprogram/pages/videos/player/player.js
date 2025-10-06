// pages/videos/player/player.js
const app = getApp();

Page({
  data: {
    videoId: 0,
    video: {},
    loading: true,
    videoContext: null,
    currentTime: 0,
    lastRecordTime: 0, // 上次记录进度的时间
  },

  onLoad(options) {
    if (options.id) {
      this.setData({ videoId: options.id });
      this.loadVideo();
    }
  },

  onReady() {
    // 创建视频上下文
    this.videoContext = wx.createVideoContext("mainVideo", this);
  },

  onHide() {
    // 离开页面时保存进度
    this.saveProgress();
  },

  onUnload() {
    // 页面卸载时保存进度
    this.saveProgress();
  },

  // 加载视频详情
  loadVideo() {
    wx.showLoading({ title: "加载中..." });

    wx.request({
      url: `${app.globalData.apiBaseUrl}/videos/${this.data.videoId}`,
      success: (res) => {
        console.log("视频详情返回:", res);

        if (res.statusCode === 200 && res.data.code === 200) {
          this.setData({
            video: res.data.data,
            loading: false,
          });
        } else {
          wx.showToast({
            title: res.data.message || "加载失败",
            icon: "none",
          });
          this.setData({ loading: false });
        }
      },
      fail: (err) => {
        console.error("加载视频失败:", err);
        wx.showToast({
          title: "网络错误",
          icon: "none",
        });
        this.setData({ loading: false });
      },
      complete: () => {
        wx.hideLoading();
      },
    });
  },

  // 格式化时长
  formatDuration(seconds) {
    if (!seconds) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  },

  // 视频错误处理
  onVideoError(e) {
    console.error("视频加载失败:", e.detail);
    wx.showToast({
      title: "视频加载失败，请检查网络或稍后重试",
      icon: "none",
      duration: 2000,
    });
  },

  // 视频播放事件
  onVideoPlay(e) {
    console.log("视频开始播放:", e);
  },

  // 视频暂停事件
  onVideoPause(e) {
    console.log("视频暂停:", e);
    this.saveProgress();
  },

  // 视频播放结束
  onVideoEnded(e) {
    console.log("视频播放结束:", e);
    // 标记为已完成
    this.saveProgress(true);
  },

  // 时间更新事件
  onTimeUpdate(e) {
    const currentTime = Math.floor(e.detail.currentTime);
    this.setData({ currentTime });

    // 每10秒保存一次进度
    if (currentTime - this.data.lastRecordTime >= 10) {
      this.saveProgress();
      this.setData({ lastRecordTime: currentTime });
    }
  },

  // 保存学习进度
  saveProgress(completed = false) {
    const token = wx.getStorageSync("token");
    if (!token) {
      console.log("未登录，不保存进度");
      return;
    }

    const duration = this.data.video.duration || 0;
    const currentTime = this.data.currentTime || 0;
    const progress = completed
      ? 100
      : duration > 0
      ? Math.floor((currentTime / duration) * 100)
      : 0;

    wx.request({
      url: `${app.globalData.apiBaseUrl}/videos/${this.data.videoId}/progress`,
      method: "POST",
      header: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        progress,
        lastPosition: currentTime,
      },
      success: (res) => {
        console.log("进度保存成功:", res);
      },
      fail: (err) => {
        console.error("进度保存失败:", err);
      },
    });
  },
});
