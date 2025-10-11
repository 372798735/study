import request from "./request";
import type {
  VideoNoteForm,
  VideoNoteListResponse,
  VideoNoteResponse,
} from "@/types/video-note";

/**
 * 获取视频号笔记列表
 */
export function getVideoNotes(params?: {
  page?: number;
  limit?: number;
  keyword?: string;
}) {
  return request.get<VideoNoteListResponse>("/video-notes", { params });
}

/**
 * 获取视频号笔记详情
 */
export function getVideoNote(id: number) {
  return request.get<VideoNoteResponse>(`/video-notes/${id}`);
}

/**
 * 创建视频号笔记
 */
export function createVideoNote(data: VideoNoteForm) {
  return request.post<VideoNoteResponse>("/video-notes", data);
}

/**
 * 更新视频号笔记
 */
export function updateVideoNote(id: number, data: Partial<VideoNoteForm>) {
  return request.patch<VideoNoteResponse>(`/video-notes/${id}`, data);
}

/**
 * 删除视频号笔记
 */
export function deleteVideoNote(id: number) {
  return request.delete(`/video-notes/${id}`);
}
