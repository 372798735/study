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
    page: 1,
    limit: 10,
    hasMore: true,
    loading: false,
  },

  onLoad() {
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

    const { category, difficulty, keyword, page, limit } = this.data;

    // 只传递有值的参数
    const params = { page, limit };
    if (category) params.category = category;
    if (difficulty) params.difficulty = difficulty;
    if (keyword) params.keyword = keyword;

    wx.request({
      url: `${app.globalData.apiBaseUrl}/questions`,
      data: params,
      success: (res) => {
        console.log("题目列表返回:", res);

        if (res.statusCode === 200 && res.data.code === 200) {
          // 后端返回格式：{ code: 200, data: { list, total, page, limit } }
          const responseData = res.data.data;
          const newQuestions = responseData.list || [];
          const total = responseData.total || 0;

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

  // 分类筛选
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
});
