// pages/index/index.js
const app = getApp();

Page({
  data: {
    stats: {
      questionCount: 0,
      videoCount: 0,
      studyDays: 0,
    },
    questions: [],
    videos: [],
  },

  onLoad() {
    this.loadData();
  },

  onShow() {
    // 页面显示时刷新数据
    this.loadData();
  },

  // 加载数据
  loadData() {
    this.loadStats();
    this.loadQuestions();
    this.loadVideos();
  },

  // 加载统计数据
  loadStats() {
    // TODO: 调用后端API获取统计数据
    // wx.request({
    //   url: `${app.globalData.apiBaseUrl}/statistics/overview`,
    //   success: (res) => {
    //     this.setData({
    //       stats: res.data.data
    //     })
    //   }
    // })

    // 模拟数据
    this.setData({
      stats: {
        questionCount: 156,
        videoCount: 48,
        studyDays: 15,
      },
    });
  },

  // 加载题目列表（最多3条）
  loadQuestions() {
    wx.request({
      url: `${app.globalData.apiBaseUrl}/questions`,
      data: {
        page: 1,
        limit: 3, // 首页最多显示3条
      },
      success: (res) => {
        console.log("首页热门题目返回:", res);

        if (res.statusCode === 200 && res.data.code === 200) {
          const questions = res.data.data.list || [];
          this.setData({
            questions: questions.slice(0, 3), // 确保最多3条
          });
        } else {
          console.error("加载题目失败:", res.data.message);
          // 失败时显示空列表
          this.setData({
            questions: [],
          });
        }
      },
      fail: (err) => {
        console.error("加载题目网络错误:", err);
        // 网络错误时显示空列表
        this.setData({
          questions: [],
        });
      },
    });
  },

  // 加载视频列表
  loadVideos() {
    // TODO: 调用后端API
    // wx.request({
    //   url: `${app.globalData.apiBaseUrl}/videos`,
    //   data: { page: 1, limit: 3 },
    //   success: (res) => {
    //     this.setData({
    //       videos: res.data.data.items
    //     })
    //   }
    // })

    // 模拟数据
    this.setData({
      videos: [
        {
          id: 1,
          title: "高等数学基础入门",
          category: "数学",
          duration: 45,
        },
        {
          id: 2,
          title: "英语口语练习",
          category: "英语",
          duration: 30,
        },
      ],
    });
  },

  // 训练系统 - 客观题
  goToObjectiveQuestions() {
    wx.navigateTo({
      url: "/pages/questions/papers/papers?questionCategory=objective",
    });
  },

  // 视频号笔记
  goToVideoNotes() {
    wx.navigateTo({
      url: "/pages/video-notes/list/list",
    });
  },

  // 训练系统 - 主观题
  goToSubjectiveQuestions() {
    wx.navigateTo({
      url: "/pages/questions/papers/papers?questionCategory=subjective",
    });
  },

  // 学习视频
  goToStudyVideos() {
    wx.navigateTo({
      url: "/pages/videos/categories/categories",
    });
  },

  // 错题本
  goToWrongBook() {
    wx.navigateTo({
      url: "/pages/wrong-book/wrong-book",
    });
  },

  // 下载专区
  goToDownload() {
    wx.showToast({
      title: "下载专区功能开发中",
      icon: "none",
    });
  },
});
