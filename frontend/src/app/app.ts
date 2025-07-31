import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: ` 
  <div class="app-container">
    <router-outlet></router-outlet>
  </div>`,
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('frontend');
}
