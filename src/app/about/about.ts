import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Footer } from '../shared/footer/footer';

@Component({
  selector: 'app-about',
  imports: [CommonModule, Footer],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {}
