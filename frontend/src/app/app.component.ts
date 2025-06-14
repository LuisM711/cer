import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FooterComponent],
  template: '<router-outlet></router-outlet><app-footer></app-footer>',
  // styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
}
