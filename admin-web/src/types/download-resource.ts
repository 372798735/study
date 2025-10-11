export interface DownloadResource {
  id: number;
  title: string;
  description?: string;
  fileUrl: string;
  fileType: "word" | "pdf";
  fileName: string;
  fileSize?: number;
  createdAt: string;
  updatedAt: string;
}

export interface DownloadResourceForm {
  title: string;
  description?: string;
  fileUrl: string;
  fileType: "word" | "pdf";
  fileName: string;
  fileSize?: number;
}

export interface DownloadResourceListResponse {
  code: number;
  data: {
    list: DownloadResource[];
    total: number;
    page: number;
    limit: number;
  };
  message: string;
}

export interface DownloadResourceResponse {
  code: number;
  data: DownloadResource;
  message: string;
}
