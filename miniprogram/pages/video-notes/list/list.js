// pages/video-notes/list/list.js
const app = getApp();

Page({
  data: {
    notes: [],
    loading: false,
    page: 1,
    limit: 10,
    hasMore: true,
  },

  onLoad() {
    wx.setNavigationBarTitle({
      title: "视频号笔记",
    });
    this.loadNotes();
  },

  // 加载笔记列表
  loadNotes() {
    if (this.data.loading || !this.data.hasMore) return;

    this.setData({ loading: true });

    const params = {
      page: this.data.page,
      limit: this.data.limit,
    };

    wx.request({
      url: `${app.globalData.apiBaseUrl}/video-notes`,
      method: "GET",
      data: params,
      success: (res) => {
        console.log("笔记列表返回:", res);

        if (res.statusCode === 200 && res.data.code === 200) {
          const newNotes = res.data.data.list || [];
          const hasMore = newNotes.length >= this.data.limit;

          this.setData({
            notes:
              this.data.page === 1
                ? newNotes
                : [...this.data.notes, ...newNotes],
            hasMore,
            loading: false,
          });
        } else {
          console.error("加载笔记失败:", res.data.message);
          wx.showToast({
            title: "加载失败",
            icon: "none",
          });
          this.setData({ loading: false });
        }
      },
      fail: (err) => {
        console.error("加载笔记网络错误:", err);
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
      notes: [],
      hasMore: true,
    });
    this.loadNotes();
    wx.stopPullDownRefresh();
  },

  // 上拉加载更多
  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.setData({
        page: this.data.page + 1,
      });
      this.loadNotes();
    }
  },

  // 预览文件
  previewFile(e) {
    const { url, type, title } = e.currentTarget.dataset;

    console.log("预览文件:", { url, type, title });

    // 检查URL是否为空
    if (!url) {
      wx.showToast({
        title: "文件地址为空",
        icon: "none",
      });
      return;
    }

    // 显示加载提示
    wx.showLoading({
      title: "正在下载...",
      mask: true,
    });

    // 确定文件类型
    let fileType = "pdf";
    if (type === "word") {
      fileType = "doc";
    }

    // 下载并预览文件
    wx.downloadFile({
      url: url,
      success: (res) => {
        wx.hideLoading();

        console.log("下载成功:", res);

        if (res.statusCode === 200) {
          const filePath = res.tempFilePath;

          // 打开文档
          wx.openDocument({
            filePath: filePath,
            fileType: fileType,
            showMenu: true,
            success: () => {
              console.log("打开文档成功");
            },
            fail: (err) => {
              console.error("打开文档失败:", err);
              wx.showModal({
                title: "无法打开文档",
                content: `错误信息: ${err.errMsg || "未知错误"}`,
                showCancel: false,
              });
            },
          });
        } else {
          console.error("下载失败，状态码:", res.statusCode);
          wx.showModal({
            title: "下载失败",
            content: `HTTP状态码: ${res.statusCode}`,
            showCancel: false,
          });
        }
      },
      fail: (err) => {
        wx.hideLoading();
        console.error("下载文件失败:", err);

        // 详细的错误提示
        let errorMsg = "下载失败";
        if (err.errMsg) {
          if (err.errMsg.includes("domain")) {
            errorMsg = "请在微信小程序后台配置下载域名白名单";
          } else if (err.errMsg.includes("timeout")) {
            errorMsg = "下载超时，请检查网络";
          } else {
            errorMsg = err.errMsg;
          }
        }

        wx.showModal({
          title: "下载失败",
          content: errorMsg,
          showCancel: false,
        });
      },
    });
  },

  // 格式化文件大小
  formatFileSize(bytes) {
    if (!bytes) return "-";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  },
});
