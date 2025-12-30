import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { Logoutservice } from '../../services/logoutservice';
import { HttpClient } from '@angular/common/http';
import { Student } from '../../interfaces/student';

@Component({
  selector: 'app-aside',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './aside.html',
  styleUrl: './aside.scss',
})
export class Aside implements OnInit {
  protected logoutservice = inject(Logoutservice);
  isAsideOpen = false;
  private http = inject(HttpClient);
  protected studentInfo: any = {};

  ngOnInit(): void {
    this.getUserInfo();
  }
  toggleAside() {
    this.isAsideOpen = !this.isAsideOpen;
  }

  getUserInfo() {
    this.http.get<Student[]>('http://localhost:3000/approvedStuds').subscribe({
      next: (response) => {
        this.http.get<any>('http://localhost:3000/auth').subscribe({
          next: (res) => {
            if (res.loggedIn === true) {
              const loggedIn = response.find(
                (check) =>
                  check.email === res.email && check.status === 'approved' && res.role === 'student'
              );

              this.studentInfo = loggedIn;
            }
          },
        });
      },
    });
  }
}
