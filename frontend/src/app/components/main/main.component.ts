import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { AppService } from '../../app.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, MatCardModule, RouterModule, MatIconModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
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
