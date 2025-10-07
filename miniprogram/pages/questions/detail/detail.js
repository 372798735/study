// pages/questions/detail/detail.js
const app = getApp();

Page({
  data: {
    questionId: 0,
    question: {},
    selectedAnswers: [], // 用户选择的答案
    correctAnswer: [], // 正确答案（拆分成数组）
    submitted: false, // 是否已提交
    isCorrect: false, // 答案是否正确
    loading: true,
    isFavorite: false, // 是否已收藏
  },

  onLoad(options) {
    if (options.id) {
      this.setData({ questionId: options.id });
      this.loadQuestion();
      this.checkFavoriteStatus();
    }
  },

  // 加载题目详情
  loadQuestion() {
    wx.showLoading({ title: "加载中..." });

    wx.request({
      url: `${app.globalData.apiBaseUrl}/questions/${this.data.questionId}`,
      success: (res) => {
        console.log("题目详情返回:", res);

        if (res.statusCode === 200 && res.data.code === 200) {
          const question = res.data.data;

          // 处理选项（如果是JSON字符串则解析）
          if (typeof question.options === "string") {
            try {
              question.options = JSON.parse(question.options);
            } catch (e) {
              console.error("解析选项失败:", e);
              question.options = [];
            }
          }

          // 将正确答案拆分成数组（如 "AB" -> ["A", "B"]）
          const correctAnswer = question.answer
            ? question.answer.split("")
            : [];

          this.setData({
            question,
            correctAnswer,
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
      complete: () => {
        wx.hideLoading();
      },
    });
  },

  // 获取选项标签（A、B、C、D...）
  getOptionLabel(index) {
    return String.fromCharCode(65 + index); // 65 是 'A' 的 ASCII 码
  },

  // 选择选项
  selectOption(e) {
    if (this.data.submitted) return; // 已提交不能再选

    const optionIndex = e.currentTarget.dataset.index;
    const optionLabel = this.getOptionLabel(optionIndex);

    let selectedAnswers = [...this.data.selectedAnswers];

    if (this.data.question.type === "multiple") {
      // 多选题：切换选中状态
      const index = selectedAnswers.indexOf(optionLabel);
      if (index > -1) {
        selectedAnswers.splice(index, 1);
      } else {
        selectedAnswers.push(optionLabel);
      }
    } else {
      // 单选题/判断题：只能选一个
      selectedAnswers = [optionLabel];
    }

    this.setData({ selectedAnswers });
  },

  // 提交答案
  submitAnswer() {
    if (this.data.selectedAnswers.length === 0) {
      wx.showToast({
        title: "请先选择答案",
        icon: "none",
      });
      return;
    }

    // 判断答案是否正确
    const userAnswer = this.data.selectedAnswers.sort().join("");
    const correctAnswer = this.data.correctAnswer.sort().join("");
    const isCorrect = userAnswer === correctAnswer;

    this.setData({
      submitted: true,
      isCorrect,
    });

    // TODO: 调用后端API记录答题结果
    // wx.request({
    //   url: `${app.globalData.apiBaseUrl}/questions/${this.data.questionId}/answer`,
    //   method: 'POST',
    //   data: {
    //     answer: userAnswer,
    //     isCorrect
    //   }
    // });

    // 显示结果提示
    if (isCorrect) {
      wx.showToast({
        title: "回答正确！",
        icon: "success",
      });
    } else {
      wx.showToast({
        title: "回答错误，请查看解析",
        icon: "none",
      });
    }
  },

  // 重新答题
  retryQuestion() {
    this.setData({
      selectedAnswers: [],
      submitted: false,
      isCorrect: false,
    });

    // 滚动到顶部
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300,
    });
  },

  // 检查收藏状态
  checkFavoriteStatus() {
    const token = wx.getStorageSync("token");

    // 未登录或快速登录，直接从本地存储检查
    if (!token || this.isQuickLogin(token)) {
      const localFavorites = wx.getStorageSync("favorites") || [];
      const isFavorite = localFavorites.includes(String(this.data.questionId));
      this.setData({ isFavorite });
      console.log("从本地存储检查收藏状态:", isFavorite);
      return;
    }

    // 完整登录，从后端获取收藏状态
    wx.request({
      url: `${app.globalData.apiBaseUrl}/favorites/check`,
      method: "GET",
      header: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        contentId: this.data.questionId,
        contentType: "question",
      },
      success: (res) => {
        console.log("后端收藏状态检查:", res);
        if (res.statusCode === 200 && res.data.code === 200) {
          this.setData({
            isFavorite: res.data.data.isFavorite || false,
          });
        } else {
          // 后端返回错误，使用本地存储
          this.checkLocalFavorite();
        }
      },
      fail: (err) => {
        console.error("检查收藏状态失败:", err);
        // 失败时从本地存储检查
        this.checkLocalFavorite();
      },
    });
  },

  // 检查本地收藏状态
  checkLocalFavorite() {
    const localFavorites = wx.getStorageSync("favorites") || [];
    const isFavorite = localFavorites.includes(String(this.data.questionId));
    this.setData({ isFavorite });
  },

  // 判断是否是快速登录
  isQuickLogin(token) {
    return token && token.startsWith("quick_login_");
  },

  // 切换收藏状态
  toggleFavorite() {
    const token = wx.getStorageSync("token");

    if (!token) {
      // 未登录，提示登录
      wx.showModal({
        title: "提示",
        content: "收藏功能需要登录后使用，是否前往登录？",
        confirmText: "去登录",
        success: (res) => {
          if (res.confirm) {
            wx.switchTab({
              url: "/pages/profile/profile",
            });
          }
        },
      });
      return;
    }

    const newStatus = !this.data.isFavorite;

    // 先更新UI（乐观更新）
    this.setData({
      isFavorite: newStatus,
    });

    // 判断登录方式
    if (this.isQuickLogin(token)) {
      // 快速登录：仅使用本地存储
      console.log("快速登录模式，使用本地存储");
      this.saveToLocal(newStatus);
      wx.showToast({
        title: newStatus ? "已收藏（本地）" : "已取消收藏",
        icon: "success",
        duration: 1500,
      });
    } else {
      // 完整登录：调用后端API
      console.log("完整登录模式，调用后端API");
      if (newStatus) {
        this.addFavorite(token);
      } else {
        this.removeFavorite(token);
      }
    }
  },

  // 添加收藏
  addFavorite(token) {
    wx.request({
      url: `${app.globalData.apiBaseUrl}/favorites`,
      method: "POST",
      header: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        contentId: this.data.questionId,
        contentType: "question",
      },
      success: (res) => {
        console.log("收藏成功:", res);
        if (res.statusCode === 200 || res.statusCode === 201) {
          wx.showToast({
            title: "收藏成功",
            icon: "success",
            duration: 1500,
          });

          // 同时保存到本地
          this.saveToLocal(true);
        } else {
          // 收藏失败，回滚状态
          this.setData({ isFavorite: false });
          wx.showToast({
            title: res.data.message || "收藏失败",
            icon: "none",
          });
        }
      },
      fail: (err) => {
        console.error("收藏请求失败:", err);
        // 网络错误，保存到本地
        this.saveToLocal(true);
        wx.showToast({
          title: "已保存到本地收藏",
          icon: "success",
        });
      },
    });
  },

  // 取消收藏
  removeFavorite(token) {
    wx.request({
      url: `${app.globalData.apiBaseUrl}/favorites`,
      method: "DELETE",
      header: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        contentId: this.data.questionId,
        contentType: "question",
      },
      success: (res) => {
        console.log("取消收藏成功:", res);
        if (res.statusCode === 200) {
          wx.showToast({
            title: "已取消收藏",
            icon: "success",
            duration: 1500,
          });

          // 同时从本地移除
          this.saveToLocal(false);
        } else {
          // 取消失败，回滚状态
          this.setData({ isFavorite: true });
          wx.showToast({
            title: res.data.message || "取消收藏失败",
            icon: "none",
          });
        }
      },
      fail: (err) => {
        console.error("取消收藏请求失败:", err);
        // 网络错误，从本地移除
        this.saveToLocal(false);
        wx.showToast({
          title: "已从本地收藏移除",
          icon: "success",
        });
      },
    });
  },

  // 保存到本地存储（备份方案）
  saveToLocal(isFavorite) {
    try {
      let favorites = wx.getStorageSync("favorites") || [];
      const questionId = String(this.data.questionId);

      if (isFavorite) {
        // 添加收藏
        if (!favorites.includes(questionId)) {
          favorites.push(questionId);
        }
      } else {
        // 取消收藏
        favorites = favorites.filter((id) => id !== questionId);
      }

      wx.setStorageSync("favorites", favorites);
    } catch (e) {
      console.error("保存到本地失败:", e);
    }
  },

  // 视频错误处理
  onVideoError(e) {
    console.error("视频加载失败:", e.detail);
    wx.showToast({
      title: "视频加载失败",
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
  },
});
