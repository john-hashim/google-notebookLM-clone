import { Injectable, signal } from '@angular/core';
import { UploadedFile } from '../models/app.models';

@Injectable({
  providedIn: 'root',
})
export class AppStateService {
  uploadedFile = signal<UploadedFile | null>(null);
  isLoading = signal(false);

  setUploadedFile(file: UploadedFile) {
    this.uploadedFile.set(file);
  }

  setLoading(loading: boolean) {
    this.isLoading.set(loading);
  }

  clearFile() {
    this.uploadedFile.set(null);
  }

}