import { Component, inject, OnInit } from '@angular/core';
import { AppStateService } from '../../service/app-state.service';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@Component({
  selector: 'app-chat-view',
  standalone: true,
  imports: [PdfViewerModule],
  templateUrl: './chat-view.component.html',
  styleUrl: './chat-view.component.scss',
})
export class ChatViewComponent implements OnInit {
  appStore = inject(AppStateService);
  router = inject(Router);
  sanitizer = inject(DomSanitizer);

  ngOnInit(): void {
    if (!this.appStore.uploadedFile()){
      this.router.navigate(['/']);
    } 
  }

}
