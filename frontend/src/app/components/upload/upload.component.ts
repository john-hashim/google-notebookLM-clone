import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AppStateService } from '../../service/app-state.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss'
})
export class UploadComponent {
  appStore = inject(AppStateService)
  router = inject(Router)

  handleFile(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (file.type === 'application/pdf') {
        const url = URL.createObjectURL(file);
        const uploadedFile = {
          file: file,
          url: url,
          name: file.name,
        };
        this.appStore.setUploadedFile(uploadedFile);
        this.router.navigate(['/chat'])
      } else {
        alert('Please select a PDF file only.');
        input.value = '';
      }
    }
  }
}
