// 网络请求封装

/**
 * 发起网络请求
 * @param {Object} options 请求配置
 */
function request(options) {
  return new Promise((resolve, reject) => {
    // 在函数内部获取 app 实例，避免初始化时序问题
    const app = getApp();
    const BASE_URL = app.globalData.apiBaseUrl;

    // 获取token
    const token = wx.getStorageSync("token");

    // 发起请求
    wx.request({
      url: `${BASE_URL}${options.url}`,
      method: options.method || "GET",
      data: options.data || {},
      header: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
        ...options.header,
      },
      success(res) {
        // 请求成功
        if (res.statusCode === 200) {
          resolve(res.data);
        } else if (res.statusCode === 401) {
          // token过期，清除并跳转登录
          wx.removeStorageSync("token");
          wx.showToast({
            title: "请先登录",
            icon: "none",
          });
          reject(res.data);
        } else {
          // 其他错误
          wx.showToast({
            title: res.data.message || "请求失败",
            icon: "none",
          });
          reject(res.data);
        }
      },
      fail(err) {
        // 网络错误
        wx.showToast({
          title: "网络错误",
          icon: "none",
        });
        reject(err);
      },
    });
  });
}

/**
 * GET请求
 */
function get(url, data) {
  return request({
    url,
    method: "GET",
    data,
  });
}

/**
 * POST请求
 */
function post(url, data) {
  return request({
    url,
    method: "POST",
    data,
  });
}

/**
 * PUT请求
 */
function put(url, data) {
  return request({
    url,
    method: "PUT",
    data,
  });
}

/**
 * DELETE请求
 */
function del(url, data) {
  return request({
    url,
    method: "DELETE",
    data,
  });
}

module.exports = {
  request,
  get,
  post,
  put,
  delete: del,
};
