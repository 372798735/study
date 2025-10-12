// pages/videos/list/list.js
const app = getApp();
const { request } = require("../../../utils/request");

Page({
  data: {
    category: "",
    categoryLabel: "",
    videos: [],
    loading: false,
    page: 1,
    limit: 10,
    hasMore: true,
  },

  onLoad(options) {
    if (options.category) {
      this.setData({
        category: decodeURIComponent(options.category),
        categoryLabel: decodeURIComponent(
          options.categoryLabel || options.category
        ),
      });

      // 设置导航栏标题
      wx.setNavigationBarTitle({
        title: this.data.categoryLabel,
      });
    }

    this.loadVideos();
  },

  // 加载视频列表
  async loadVideos() {
    if (this.data.loading || !this.data.hasMore) return;

    this.setData({ loading: true });

    const params = {
      page: this.data.page,
      limit: this.data.limit,
    };

    if (this.data.category) {
      params.category = this.data.category;
    }

    try {
      const res = await request({
        url: "/videos",
        method: "GET",
        data: params,
      });

      console.log("视频列表返回:", res);

      if (res.code === 200) {
        const newVideos = res.data.list || [];
        const hasMore = newVideos.length >= this.data.limit;

        this.setData({
          videos:
            this.data.page === 1
              ? newVideos
              : [...this.data.videos, ...newVideos],
          hasMore,
        });
      } else {
        console.error("加载视频失败:", res.message);
        wx.showToast({
          title: res.message || "加载失败",
          icon: "none",
        });
      }
    } catch (err) {
      console.error("加载视频错误:", err);
    } finally {
      this.setData({ loading: false });
    }
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.setData({
      page: 1,
      videos: [],
      hasMore: true,
    });
    this.loadVideos();
    wx.stopPullDownRefresh();
  },

  // 上拉加载更多
  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.setData({
        page: this.data.page + 1,
      });
      this.loadVideos();
    }
  },

  // 播放视频
  playVideo(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/videos/player/player?id=${id}`,
    });
  },
});
