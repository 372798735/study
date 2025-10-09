// 题目类型
export type QuestionType = "single" | "multiple" | "fill" | "essay";

// 题目分类（客观题/主观题）
export type QuestionCategoryType = "objective" | "subjective";

// 难度级别
export type DifficultyLevel = "easy" | "medium" | "hard";

// 试题类型（真题/模拟题/专题）
export type ExamType = "real" | "mock" | "special";

// 题目
export interface Question {
  id: number;
  title: string;
  content: string;
  type: QuestionType;
  questionCategory: QuestionCategoryType;
  examType?: ExamType;
  paperName?: string;
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
  questionCategory: QuestionCategoryType;
  examType?: ExamType;
  paperName?: string;
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
  questionCategory?: QuestionCategoryType;
  examType?: ExamType;
  paperName?: string;
}

// 题目列表响应
export interface QuestionListResponse {
  list: Question[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
