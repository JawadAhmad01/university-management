import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-main-page',
  imports: [CommonModule, RouterLink],
  templateUrl: './main-page.html',
  styleUrl: './main-page.scss',
})
export class MainPage {
  currentYear = new Date().getFullYear();
}
