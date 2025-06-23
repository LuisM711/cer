import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { AppService } from '../../app.service';
import { MatTooltipModule } from '@angular/material/tooltip';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatCardModule, RouterModule, MatIconModule, MatTooltipModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  
  showNotifications: boolean = false;
  birthdays: any[] = [];
  isAdmin: boolean = false;
  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }
  constructor(private appService: AppService) { }
  ngOnInit() {
    this.appService.verifyAdmin().subscribe(
      (response: any) => {
        this.isAdmin = response.success;
        if(this.isAdmin) {
          this.getBirthdays();
        }
      },
      (error: any) => {
        console.error('Error verifying admin status:', error);
      }
    );
    
    
  }
  getBirthdays() {
    this.appService.getBirthdays().subscribe(
      (response: any) => {
        this.birthdays = response.data;
        console.log(this.birthdays);
      },
      (error: any) => {
        console.error('Error fetching birthdays:', error);
      }
    );
  }
  logout() {
    this.appService.logout().subscribe(
      (response: any) => {
        console.log('Logout successful:', response);
        window.location.href = '/';
      },
      (error: any) => {
        console.error('Error during logout:', error);
      }
    );
  }

}