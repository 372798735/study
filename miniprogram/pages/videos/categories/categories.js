// pages/videos/categories/categories.js
const app = getApp();
const { request } = require("../../../utils/request");

Page({
  data: {
    categories: [],
    loading: false,
  },

  onLoad() {
    this.loadCategories();
  },

  // 加载视频分类列表
  async loadCategories() {
    this.setData({ loading: true });

    try {
      const res = await request({
        url: "/dictionary/type/video_category",
        method: "GET",
      });

      console.log("视频分类返回:", res);

      if (res.code === 200) {
        this.setData({
          categories: res.data || [],
        });
      } else {
        console.error("加载视频分类失败:", res.message);
        wx.showToast({
          title: res.message || "加载失败",
          icon: "none",
        });
      }
    } catch (err) {
      console.error("加载视频分类错误:", err);
    } finally {
      this.setData({ loading: false });
    }
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
