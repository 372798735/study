// pages/videos/categories/categories.js
const app = getApp();

Page({
  data: {
    categories: [],
    loading: false,
  },

  onLoad() {
    this.loadCategories();
  },

  // 加载视频分类列表
  loadCategories() {
    this.setData({ loading: true });

    wx.request({
      url: `${app.globalData.apiBaseUrl}/dictionary/type/video_category`,
      method: "GET",
      success: (res) => {
        console.log("视频分类返回:", res);

        if (res.statusCode === 200 && res.data.code === 200) {
          this.setData({
            categories: res.data.data || [],
            loading: false,
          });
        } else {
          console.error("加载视频分类失败:", res.data.message);
          wx.showToast({
            title: "加载失败",
            icon: "none",
          });
          this.setData({ loading: false });
        }
      },
      fail: (err) => {
        console.error("加载视频分类网络错误:", err);
        wx.showToast({
          title: "网络错误",
          icon: "none",
        });
        this.setData({ loading: false });
      },
    });
  },

  // 进入某个分类的视频列表
  goToCategoryVideos(e) {
    const category = e.currentTarget.dataset.value;
    const categoryLabel = e.currentTarget.dataset.label;

    wx.navigateTo({
      url: `/pages/videos/list/list?category=${encodeURIComponent(
        category
      )}&categoryLabel=${encodeURIComponent(categoryLabel)}`,
    });
  },
});
