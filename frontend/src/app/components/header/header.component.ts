import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { AppService } from '../../app.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatCardModule, RouterModule, MatIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  showNotifications: boolean = false;
  birthdays: any[] = [];

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }
  constructor(private appService: AppService) { }
  ngOnInit() {
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

}