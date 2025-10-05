import axios from "axios";
import { ElMessage } from "element-plus";
import { getToken, removeToken } from "@/utils/auth";
import type { AxiosResponse, AxiosError } from "axios";

// 创建axios实例
const service = axios.create({
  baseURL: "/api/v1",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 添加token
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("请求错误:", error);
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const { data } = response;

    // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
    if (data.code === 200 || response.status === 200) {
      return data;
    } else {
      // 否则的话抛出错误
      ElMessage.error(data.message || "请求失败");
      return Promise.reject(new Error(data.message || "请求失败"));
    }
  },
  (error: AxiosError) => {
    console.error("响应错误:", error);

    if (error.response) {
      const { status, data } = error.response as any;

      switch (status) {
        case 401:
          ElMessage.error("登录已过期，请重新登录");
          // 清除token并跳转到登录页
          removeToken();
          window.location.href = "/login";
          break;
        case 403:
          ElMessage.error("没有权限访问该资源");
          break;
        case 404:
          ElMessage.error("请求的资源不存在");
          break;
        case 500:
          ElMessage.error("服务器内部错误");
          break;
        default:
          ElMessage.error(data?.message || "请求失败");
      }
    } else if (error.request) {
      ElMessage.error("网络连接失败，请检查网络");
    } else {
      ElMessage.error("请求配置错误");
    }

    return Promise.reject(error);
  }
);

export default service;
