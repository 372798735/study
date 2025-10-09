// pages/questions/papers/papers.js
const app = getApp();

Page({
  data: {
    papers: [],
    questionCategory: "", // objective 或 subjective
    isWrongBook: false, // 是否是错题本模式
    loading: false,
  },

  onLoad(options) {
    // 接收题目类型参数（客观题/主观题）
    if (options.questionCategory) {
      this.setData({
        questionCategory: options.questionCategory,
      });
    }

    // 是否是错题本模式
    if (options.isWrongBook) {
      this.setData({
        isWrongBook: options.isWrongBook === "true",
      });
    }

    this.loadPapers();
  },

  // 加载试卷列表
  loadPapers() {
    if (this.data.loading) return;

    this.setData({ loading: true });

    let url;
    let params = {};

    if (this.data.isWrongBook) {
      // 错题本模式：获取错题试卷列表
      url = `${app.globalData.apiBaseUrl}/wrong-book/papers`;
      if (this.data.questionCategory) {
        params.questionCategory = this.data.questionCategory;
      }
    } else {
      // 普通模式：获取所有试卷
      url = `${app.globalData.apiBaseUrl}/dictionary/type/paper_name`;
    }

    wx.request({
      url,
      data: params,
      success: (res) => {
        console.log("试卷列表返回:", res);

        if (res.statusCode === 200 && res.data.code === 200) {
          const papers = res.data.data || [];

          this.setData({
            papers,
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
        console.error("加载试卷失败:", err);
        wx.showToast({
          title: "网络错误",
          icon: "none",
        });
        this.setData({ loading: false });
      },
    });
  },

  // 跳转到试卷题目列表
  goToPaperQuestions(e) {
    const paperName = e.currentTarget.dataset.value;
    const paperLabel = e.currentTarget.dataset.label;

    let url = `/pages/questions/list/list?paperName=${encodeURIComponent(
      paperName
    )}&paperNameLabel=${encodeURIComponent(paperLabel)}`;

    // 如果有题目类型，也传递过去
    if (this.data.questionCategory) {
      url += `&questionCategory=${this.data.questionCategory}`;
    }

    // 如果是错题本模式，也传递过去
    if (this.data.isWrongBook) {
      url += `&isWrongBook=true`;
    }

    wx.navigateTo({
      url,
    });
  },

  // 返回上一页
  goBack() {
    wx.navigateBack();
  },
});
