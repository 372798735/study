import request from "./request";
import type { LoginForm, UserInfo } from "@/types/user";

// 登录
export const login = (data: LoginForm) => {
  return request({
    url: "/auth/login",
    method: "post",
    data,
  });
};

// 获取用户信息
export const getUserInfo = () => {
  return request({
    url: "/auth/profile",
    method: "get",
  });
};

// 刷新token
export const refreshToken = () => {
  return request({
    url: "/auth/refresh",
    method: "post",
  });
};
