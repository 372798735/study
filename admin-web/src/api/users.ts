import request from "./request";

// 用户列表响应类型
export interface UserInfo {
  id: number;
  phone: string;
  nickname: string;
  avatar?: string;
  role: string;
  createdAt: string;
}

export interface UserListParams {
  page?: number;
  limit?: number;
  keyword?: string;
}

export interface UserListResponse {
  list: UserInfo[];
  total: number;
  page: number;
  limit: number;
}

export interface RegisterForm {
  phone: string;
  password: string;
  nickname: string;
}

// 获取用户列表
export const getUsers = (params?: UserListParams) => {
  return request.get<UserListResponse>("/users", { params });
};

// 注册用户（创建账号）
export const registerUser = (data: RegisterForm) => {
  return request.post<{ token: string; user: UserInfo }>(
    "/users/register",
    data
  );
};

// 删除用户
export const deleteUser = (id: number) => {
  return request.delete(`/users/${id}`);
};
