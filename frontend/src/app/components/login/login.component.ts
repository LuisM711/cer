import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AppService } from '../../app.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  correo: string = '';
  contrasena: string = '';

  constructor(private appService: AppService, private router: Router) { }

  login() {
    console.log("asdoiasdolikj");
    const loginData = {
      email: this.correo,
      password: this.contrasena
    };

    this.appService.login(loginData).subscribe({
      next: (response) => {
        // console.log('Login successful', response);
        this.router.navigate(['/main']);


      },
      error: (error) => {
        console.error('Login failed', error);
        // mostrar mensaje de error al usuario
      }
    });
  }
}
