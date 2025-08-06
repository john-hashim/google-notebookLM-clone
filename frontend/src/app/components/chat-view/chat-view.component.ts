import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AppStateService } from '../../service/app-state.service';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { UploadedFile } from '../../models/app.models';
import { FeatureService } from '../../service/feature.service';

@Component({
  selector: 'app-chat-view',
  standalone: true,
  imports: [PdfViewerModule],
  templateUrl: './chat-view.component.html',
  styleUrl: './chat-view.component.scss',
})
export class ChatViewComponent implements OnInit, OnDestroy {
  appStore = inject(AppStateService);
  router = inject(Router);
  sanitizer = inject(DomSanitizer);
  featureService = inject(FeatureService)

  ngOnInit(): void {
    const uploadedFile = this.appStore.uploadedFile();
    if (!uploadedFile) {
      this.router.navigate(['/']);
    }else{
      this.uploadPdfToBackend(uploadedFile);
    }
  }

  private uploadPdfToBackend(uploadedFile: UploadedFile) {
    this.featureService.uploadPdf(uploadedFile).subscribe({
      next: (response) => {
        console.log('PDF processed:', response);
      },
      error: (error) => {
        console.error('Upload failed:', error);
      },
    });
  }

  clearDocument(): void{
    this.featureService.clearDocument().subscribe(() => {
      this.router.navigate(['/']);
    })
  }

  ngOnDestroy(): void {
      this.clearDocument()
  }
}
