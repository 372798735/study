import request from "./request";
import type {
  DownloadResourceForm,
  DownloadResourceListResponse,
  DownloadResourceResponse,
} from "@/types/download-resource";

/**
 * 获取下载资源列表
 */
export function getDownloadResources(params?: {
  page?: number;
  limit?: number;
  keyword?: string;
}) {
  return request.get<DownloadResourceListResponse>("/download-resources", {
    params,
  });
}

/**
 * 获取下载资源详情
 */
export function getDownloadResource(id: number) {
  return request.get<DownloadResourceResponse>(`/download-resources/${id}`);
}

/**
 * 创建下载资源
 */
export function createDownloadResource(data: DownloadResourceForm) {
  return request.post<DownloadResourceResponse>("/download-resources", data);
}

/**
 * 更新下载资源
 */
export function updateDownloadResource(
  id: number,
  data: Partial<DownloadResourceForm>
) {
  return request.patch<DownloadResourceResponse>(
    `/download-resources/${id}`,
    data
  );
}

/**
 * 删除下载资源
 */
export function deleteDownloadResource(id: number) {
  return request.delete(`/download-resources/${id}`);
}
