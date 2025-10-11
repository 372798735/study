// 视频
export interface Video {
  id: number;
  title: string;
  description?: string;
  fileUrl: string;
  category: string;
  thumbnailUrl?: string;
  fileSize?: number;
  createdAt: string;
}

// 视频表单
export interface VideoForm {
  title: string;
  description?: string;
  fileUrl: string;
  category: string;
  thumbnailUrl?: string;
  fileSize?: number;
}

// 视频列表参数
export interface VideoListParams {
  page?: number;
  limit?: number;
  category?: string;
  keyword?: string;
}

// 视频列表响应
export interface VideoListResponse {
  list: Video[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
