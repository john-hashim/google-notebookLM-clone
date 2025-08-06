import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { UploadedFile, UploadResponse } from '../models/app.models';

@Injectable({
  providedIn: 'root',
})
export class FeatureService {
  private apiService = inject(ApiService);

  uploadPdf(uploadedFile: UploadedFile): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('pdf', uploadedFile.file);
    formData.append('fileName', uploadedFile.name);

    return this.apiService.postFormData<UploadResponse>(
      '/upload-pdf',
      formData
    );
  }

  clearDocument(): Observable<any> {
    return this.apiService.post('/clear-document', {});
  }
}
