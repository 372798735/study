// 登录表单
export interface LoginForm {
  username: string;
  password: string;
}

// 用户信息
export interface UserInfo {
  id: number;
  username: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}
