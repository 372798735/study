// pages/questions/list/list.js
const app = getApp();

Page({
  data: {
    questions: [],
    categories: [
      "数学",
      "语文",
      "英语",
      "物理",
      "化学",
      "生物",
      "历史",
      "地理",
    ],
    category: "",
    difficulty: "",
    keyword: "",
    questionCategory: "",
    examType: "",
    paperName: "",
    paperNameLabel: "", // 试卷名称显示文本
    isWrongBook: false, // 是否是错题本模式
    page: 1,
    limit: 10,
    hasMore: true,
    loading: false,
  },

  onLoad(options) {
    // 接收页面参数
    if (options.questionCategory) {
      this.setData({
        questionCategory: options.questionCategory,
      });
    }
    if (options.category) {
      this.setData({
        category: options.category,
      });
    }
    if (options.difficulty) {
      this.setData({
        difficulty: options.difficulty,
      });
    }
    if (options.examType) {
      this.setData({
        examType: options.examType,
      });
    }
    if (options.paperName) {
      this.setData({
        paperName: options.paperName,
      });
    }
    if (options.paperNameLabel) {
      this.setData({
        paperNameLabel: decodeURIComponent(options.paperNameLabel),
      });
    }
    if (options.isWrongBook) {
      this.setData({
        isWrongBook: options.isWrongBook === "true",
      });
    }

    // 如果有试卷名称，设置导航栏标题
    if (options.paperName && options.paperNameLabel) {
      const title = this.data.isWrongBook
        ? `错题 - ${decodeURIComponent(options.paperNameLabel)}`
        : decodeURIComponent(options.paperNameLabel);
      wx.setNavigationBarTitle({
        title,
      });
    }

    this.loadQuestions();
  },

  onShow() {
    // 从详情页返回时刷新
    if (this.data.questions.length > 0) {
      // 已有数据，不重新加载
    }
  },

  // 加载题目列表
  loadQuestions(isLoadMore = false) {
    if (this.data.loading) return;

    this.setData({ loading: true });

    const {
      category,
      difficulty,
      keyword,
      questionCategory,
      examType,
      paperName,
      isWrongBook,
      page,
      limit,
    } = this.data;

    let url;
    const params = { page, limit };

    if (isWrongBook) {
      // 错题本模式
      url = `${app.globalData.apiBaseUrl}/wrong-book`;
      if (questionCategory) params.questionCategory = questionCategory;
      if (paperName) params.paperName = paperName;
    } else {
      // 普通模式
      url = `${app.globalData.apiBaseUrl}/questions`;
      if (category) params.category = category;
      if (difficulty) params.difficulty = difficulty;
      if (keyword) params.keyword = keyword;
      if (questionCategory) params.questionCategory = questionCategory;
      if (examType) params.examType = examType;
      if (paperName) params.paperName = paperName;
    }

    wx.request({
      url,
      data: params,
      success: (res) => {
        console.log("题目列表返回:", res);

        if (res.statusCode === 200 && res.data.code === 200) {
          // 后端返回格式：{ code: 200, data: { list, total, page, limit } }
          const responseData = res.data.data;
          let newQuestions = responseData.list || [];
          const total = responseData.total || 0;

          // 如果是错题本模式，需要提取question字段
          if (
            this.data.isWrongBook &&
            newQuestions.length > 0 &&
            newQuestions[0].question
          ) {
            newQuestions = newQuestions.map((item) => ({
              ...item.question,
              wrongBookId: item.id, // 保存错题本记录ID
            }));
          }

          console.log("解析后的题目列表:", newQuestions);
          console.log("总数:", total);

          this.setData({
            questions: isLoadMore
              ? [...this.data.questions, ...newQuestions]
              : newQuestions,
            hasMore: this.data.page * this.data.limit < total,
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
        console.error("加载题目失败:", err);
        wx.showToast({
          title: "网络错误",
          icon: "none",
        });
        this.setData({ loading: false });
      },
    });
  },

  // 搜索输入
  onSearchInput(e) {
    this.setData({
      keyword: e.detail.value,
      page: 1,
    });
    // 防抖搜索
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => {
      this.loadQuestions();
    }, 500);
  },

  // 题目分类筛选（客观题/主观题）
  onQuestionCategoryChange(e) {
    const questionCategory = e.currentTarget.dataset.value;
    this.setData({
      questionCategory,
      page: 1,
    });
    this.loadQuestions();
  },

  // 学科分类筛选
  onCategoryChange(e) {
    const category = e.currentTarget.dataset.value;
    this.setData({
      category,
      page: 1,
    });
    this.loadQuestions();
  },

  // 难度筛选
  onDifficultyChange(e) {
    const difficulty = e.currentTarget.dataset.value;
    this.setData({
      difficulty,
      page: 1,
    });
    this.loadQuestions();
  },

  // 加载更多
  loadMore() {
    if (!this.data.hasMore || this.data.loading) return;
    this.setData({
      page: this.data.page + 1,
    });
    this.loadQuestions(true);
  },

  // 跳转到题目详情
  goToDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/questions/detail/detail?id=${id}`,
    });
  },

  // 移除错题本
  removeFromWrongBook(e) {
    const id = e.currentTarget.dataset.id;

    wx.showModal({
      title: "确认移除",
      content: "确定要将此题从错题本中移除吗？",
      success: (res) => {
        if (res.confirm) {
          wx.request({
            url: `${app.globalData.apiBaseUrl}/wrong-book/${id}`,
            method: "DELETE",
            success: (res) => {
              if (res.statusCode === 200 && res.data.code === 200) {
                wx.showToast({
                  title: "移除成功",
                  icon: "success",
                });
                // 刷新列表
                this.setData({ page: 1 });
                this.loadQuestions();
              } else {
                wx.showToast({
                  title: res.data.message || "移除失败",
                  icon: "none",
                });
              }
            },
            fail: (err) => {
              wx.showToast({
                title: "网络错误",
                icon: "none",
              });
            },
          });
        }
      },
    });
  },
});
