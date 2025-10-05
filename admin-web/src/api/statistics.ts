import request from "./request";

// 获取仪表板数据
export const getDashboard = () => {
  return request({
    url: "/statistics/dashboard",
    method: "get",
  });
};

// 获取题目统计
export const getQuestionStats = () => {
  return request({
    url: "/statistics/questions",
    method: "get",
  });
};

// 获取视频统计
export const getVideoStats = () => {
  return request({
    url: "/statistics/videos",
    method: "get",
  });
};

// 获取用户统计
export const getUserStats = () => {
  return request({
    url: "/statistics/users",
    method: "get",
  });
};
