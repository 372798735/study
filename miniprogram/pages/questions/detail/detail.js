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
  },

  onLoad(options) {
    if (options.id) {
      this.setData({ questionId: options.id });
      this.loadQuestion();
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

    // 客观题：答错了自动加入错题本
    if (!isCorrect && this.data.question.questionCategory === "objective") {
      this.addToWrongBook(userAnswer);
      wx.showToast({
        title: "回答错误，已加入错题本",
        icon: "none",
      });
      return;
    }

    // 主观题：选择"不会"时自动加入错题本
    if (this.data.question.questionCategory === "subjective") {
      // 检查用户是否选择了"不会"选项
      const selectedOption =
        this.data.question.options[
          this.data.selectedAnswers[0].charCodeAt(0) - 65
        ];

      // 选择"会"视为答对，选择"不会"视为答错
      const isSubjectiveCorrect = !(
        selectedOption &&
        (selectedOption === "不会" || selectedOption.includes("不会"))
      );

      this.setData({
        isCorrect: isSubjectiveCorrect,
      });

      if (!isSubjectiveCorrect) {
        // 选择"不会"，加入错题本
        this.addToWrongBook("不会");
        wx.showToast({
          title: "已加入错题本",
          icon: "none",
          duration: 2000,
        });
      } else {
        // 选择"会"
        wx.showToast({
          title: "恭喜你掌握该题",
          icon: "success",
          duration: 2000,
        });
      }
      return;
    }

    // 显示结果提示
    if (isCorrect) {
      wx.showToast({
        title: "回答正确！",
        icon: "success",
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

  // 加入错题本
  addToWrongBook(userAnswer = "") {
    wx.request({
      url: `${app.globalData.apiBaseUrl}/wrong-book`,
      method: "POST",
      data: {
        questionId: parseInt(this.data.questionId),
        userAnswer: userAnswer,
      },
      success: (res) => {
        console.log("加入错题本:", res);
        if (res.statusCode === 200 || res.statusCode === 201) {
          console.log("成功加入错题本");
        } else {
          console.error("加入错题本失败:", res);
        }
      },
      fail: (err) => {
        console.error("加入错题本失败:", err);
      },
    });
  },

  // 主观题标记不会（加入错题本）
  markAsUnknown() {
    wx.showModal({
      title: "加入错题本",
      content: "将此题加入错题本，方便复习？",
      success: (res) => {
        if (res.confirm) {
          this.addToWrongBook();
          wx.showToast({
            title: "已加入错题本",
            icon: "success",
          });
        }
      },
    });
  },
});
