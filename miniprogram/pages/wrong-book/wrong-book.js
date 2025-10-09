// pages/wrong-book/wrong-book.js
Page({
  data: {},

  // 客观题错题本
  goToObjectiveWrongBook() {
    wx.navigateTo({
      url: "/pages/questions/papers/papers?questionCategory=objective&isWrongBook=true",
    });
  },

  // 主观题错题本
  goToSubjectiveWrongBook() {
    wx.navigateTo({
      url: "/pages/questions/papers/papers?questionCategory=subjective&isWrongBook=true",
    });
  },
});
