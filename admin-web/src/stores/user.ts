import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { login, getUserInfo } from "@/api/auth";
import type { LoginForm, UserInfo } from "@/types/user";
import { getToken, setToken, removeToken } from "@/utils/auth";

export const useUserStore = defineStore("user", () => {
  const token = ref<string>(getToken());
  const userInfo = ref<UserInfo | null>(null);

  const isLoggedIn = computed(() => !!token.value);

  // 登录
  const loginAction = async (loginForm: LoginForm) => {
    try {
      const response = await login(loginForm);
      // 后端返回 { code: 200, data: { access_token, user } }
      // request.ts 拦截器返回整个响应体，所以从 response.data 获取
      const { access_token } = response.data;

      token.value = access_token;
      setToken(access_token);

      // 获取用户信息
      await getUserInfoAction();

      return response;
    } catch (error) {
      throw error;
    }
  };

  // 获取用户信息
  const getUserInfoAction = async () => {
    try {
      const response = await getUserInfo();
      userInfo.value = response.data;
      return response;
    } catch (error) {
      throw error;
    }
  };

  // 初始化用户信息
  const initUser = async () => {
    if (token.value) {
      try {
        await getUserInfoAction();
      } catch (error) {
        // 如果获取用户信息失败，清除token
        logout();
      }
    }
  };

  // 登出
  const logout = () => {
    token.value = "";
    userInfo.value = null;
    removeToken();
  };

  return {
    token,
    userInfo,
    isLoggedIn,
    loginAction,
    getUserInfoAction,
    initUser,
    logout,
  };
});
