export interface UploadedFile {
  file: File;
  url: string;
  name: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface UploadResponse {
  success: boolean;
  message: string;
  documentId?: string;
}