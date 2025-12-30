import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Signin } from '../interfaces/signin';

@Component({
  selector: 'app-nav',
  imports: [RouterOutlet, CommonModule, RouterLink],
  templateUrl: './nav.html',
  styleUrl: './nav.scss',
})
export class Nav implements OnInit {
  protected menu: boolean = false;
  private http = inject(HttpClient);
  protected adminStudBtn = '';
  isNavOpen = false;
  toggleNav() {
    this.isNavOpen = !this.isNavOpen;
  }
  closeNav() {
    this.isNavOpen = false;
  }

  ngOnInit(): void {
    this.checkLogIn();
  }

  checkLogIn() {
    this.http.get<Signin>('http://localhost:3000/auth').subscribe({
      next: (res) => {
        this.adminStudBtn = res.role;
      },
    });
  }
}
