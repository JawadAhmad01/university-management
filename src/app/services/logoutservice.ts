import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class Logoutservice {
  private router = inject(Router);
  private http = inject(HttpClient);
  logout() {
    this.http.put('http://localhost:3000/auth', { loggedIn: false, id: '', role: '' }).subscribe({
      next: (res) => {
        this.router.navigateByUrl('/');
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
