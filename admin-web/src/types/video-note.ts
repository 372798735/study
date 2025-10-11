export interface VideoNote {
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

export interface VideoNoteForm {
  title: string;
  description?: string;
  fileUrl: string;
  fileType: "word" | "pdf";
  fileName: string;
  fileSize?: number;
}

export interface VideoNoteListResponse {
  code: number;
  data: {
    list: VideoNote[];
    total: number;
    page: number;
    limit: number;
  };
  message: string;
}

export interface VideoNoteResponse {
  code: number;
  data: VideoNote;
  message: string;
}
