import request from "./request";
import type { Video, VideoForm, VideoListParams } from "@/types/video";

// 获取视频列表
export const getVideos = (params: VideoListParams) => {
  return request({
    url: "/videos",
    method: "get",
    params,
  });
};

// 获取视频详情
export const getVideo = (id: number) => {
  return request({
    url: `/videos/${id}`,
    method: "get",
  });
};

// 创建视频
export const createVideo = (data: VideoForm) => {
  return request({
    url: "/videos",
    method: "post",
    data,
  });
};

// 更新视频
export const updateVideo = (id: number, data: VideoForm) => {
  return request({
    url: `/videos/${id}`,
    method: "put",
    data,
  });
};

// 删除视频
export const deleteVideo = (id: number) => {
  return request({
    url: `/videos/${id}`,
    method: "delete",
  });
};

// 批量删除视频
export const batchDeleteVideos = (ids: number[]) => {
  return request({
    url: "/videos/batch",
    method: "delete",
    data: { ids },
  });
};
