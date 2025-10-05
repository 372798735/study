import request from "./request";

// 上传图片
export const uploadImage = (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  return request({
    url: "/upload/image",
    method: "post",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// 上传视频
export const uploadVideo = (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  return request({
    url: "/upload/video",
    method: "post",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
