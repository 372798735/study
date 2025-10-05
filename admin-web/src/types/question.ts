// 题目类型
export type QuestionType = "single" | "multiple" | "fill" | "essay";

// 难度级别
export type DifficultyLevel = "easy" | "medium" | "hard";

// 题目
export interface Question {
  id: number;
  title: string;
  content: string;
  type: QuestionType;
  options?: string[];
  answer: string;
  explanation?: string;
  category: string;
  difficulty: DifficultyLevel;
  imageUrl?: string;
  videoUrl?: string;
  videoDuration?: number;
  createdAt: string;
}

// 题目表单
export interface QuestionForm {
  title: string;
  content: string;
  type: QuestionType;
  options?: string[];
  answer: string;
  explanation?: string;
  category: string;
  difficulty: DifficultyLevel;
  imageUrl?: string;
  videoUrl?: string;
  videoDuration?: number;
}

// 题目列表参数
export interface QuestionListParams {
  page?: number;
  limit?: number;
  category?: string;
  keyword?: string;
  type?: QuestionType;
  difficulty?: DifficultyLevel;
}

// 题目列表响应
export interface QuestionListResponse {
  list: Question[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
