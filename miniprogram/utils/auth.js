// 认证相关工具函数
const request = require("./request");

/**
 * 微信登录
 */
function login() {
  return new Promise((resolve, reject) => {
    wx.login({
      success: async (res) => {
        if (res.code) {
          try {
            // 调用后端登录接口
            const result = await request.post("/auth/wechat-login", {
              code: res.code,
            });

            // 保存token
            wx.setStorageSync("token", result.data.token);

            resolve(result.data);
          } catch (err) {
            reject(err);
          }
        } else {
          reject(new Error("登录失败：" + res.errMsg));
        }
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
}

/**
 * 获取token
 */
function getToken() {
  return wx.getStorageSync("token");
}

/**
 * 设置token
 */
function setToken(token) {
  wx.setStorageSync("token", token);
}

/**
 * 移除token
 */
function removeToken() {
  wx.removeStorageSync("token");
}

/**
 * 检查是否已登录
 */
function isLoggedIn() {
  return !!getToken();
}

module.exports = {
  login,
  getToken,
  setToken,
  removeToken,
  isLoggedIn,
};
