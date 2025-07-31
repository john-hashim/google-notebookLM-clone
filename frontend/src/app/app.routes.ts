import { Routes } from '@angular/router';
import { UploadComponent } from './components/upload/upload.component';
import { ChatViewComponent } from './components/chat-view/chat-view.component';

export const routes: Routes = [
  { path: '', component: UploadComponent },
  { path: 'chat', component: ChatViewComponent },
  { path: '**', redirectTo: '' }
];

