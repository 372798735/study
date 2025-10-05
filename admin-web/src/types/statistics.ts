// 仪表板数据
export interface DashboardData {
  overview: {
    totalUsers: number;
    totalQuestions: number;
    totalVideos: number;
    totalRecords: number;
  };
  recent: {
    users: number;
    questions: number;
    videos: number;
  };
}

// 题目统计
export interface QuestionStats {
  total: number;
  byType: Array<{
    type: string;
    count: number;
  }>;
  byCategory: Array<{
    category: string;
    count: number;
  }>;
  byDifficulty: Array<{
    difficulty: string;
    count: number;
  }>;
}

// 视频统计
export interface VideoStats {
  total: number;
  byCategory: Array<{
    category: string;
    count: number;
  }>;
  totalDuration: number;
  totalSize: number;
}

// 用户统计
export interface UserStats {
  total: number;
  active: number;
  averageRecords: number;
}
