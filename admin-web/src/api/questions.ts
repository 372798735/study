import request from "./request";
import type {
  Question,
  QuestionForm,
  QuestionListParams,
} from "@/types/question";

// 获取题目列表
export const getQuestions = (params: QuestionListParams) => {
  return request({
    url: "/questions",
    method: "get",
    params,
  });
};

// 获取题目详情
export const getQuestion = (id: number) => {
  return request({
    url: `/questions/${id}`,
    method: "get",
  });
};

// 创建题目
export const createQuestion = (data: QuestionForm) => {
  return request({
    url: "/questions",
    method: "post",
    data,
  });
};

// 更新题目
export const updateQuestion = (id: number, data: QuestionForm) => {
  return request({
    url: `/questions/${id}`,
    method: "put",
    data,
  });
};

// 删除题目
export const deleteQuestion = (id: number) => {
  return request({
    url: `/questions/${id}`,
    method: "delete",
  });
};

// 批量删除题目
export const batchDeleteQuestions = (ids: number[]) => {
  return request({
    url: "/questions/batch",
    method: "delete",
    data: { ids },
  });
};
