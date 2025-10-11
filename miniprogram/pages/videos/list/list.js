// pages/videos/list/list.js
const app = getApp();

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
  loadVideos() {
    if (this.data.loading || !this.data.hasMore) return;

    this.setData({ loading: true });

    const params = {
      page: this.data.page,
      limit: this.data.limit,
    };

    if (this.data.category) {
      params.category = this.data.category;
    }

    wx.request({
      url: `${app.globalData.apiBaseUrl}/videos`,
      method: "GET",
      data: params,
      success: (res) => {
        console.log("视频列表返回:", res);

        if (res.statusCode === 200 && res.data.code === 200) {
          const newVideos = res.data.data.list || [];
          const hasMore = newVideos.length >= this.data.limit;

          this.setData({
            videos:
              this.data.page === 1
                ? newVideos
                : [...this.data.videos, ...newVideos],
            hasMore,
            loading: false,
          });
        } else {
          console.error("加载视频失败:", res.data.message);
          wx.showToast({
            title: "加载失败",
            icon: "none",
          });
          this.setData({ loading: false });
        }
      },
      fail: (err) => {
        console.error("加载视频网络错误:", err);
        wx.showToast({
          title: "网络错误",
          icon: "none",
        });
        this.setData({ loading: false });
      },
    });
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
