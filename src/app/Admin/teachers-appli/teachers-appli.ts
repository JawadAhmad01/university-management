import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { application } from '../../Teachers/application/application';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-teachers-appli',
  imports: [DatePipe],
  templateUrl: './teachers-appli.html',
  styleUrl: './teachers-appli.scss',
})
export class TeachersAppli implements OnInit {
  private http = inject(HttpClient);
  protected applicationsArr: application[] = [];

  ngOnInit(): void {
    this.getApplications();
  }

  getApplications() {
    this.http.get<application[]>('http://localhost:3000/teacherApplications').subscribe({
      next: (res) => {
        this.applicationsArr = res;
      },
    });
  }

  approve(id: string) {
    this.http
      .patch(`http://localhost:3000/teacherApplications/${id}`, { status: 'approved' })
      .subscribe({
        next: () => {
          this.getApplications();
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  reject(id: string) {
    this.http
      .patch(`http://localhost:3000/teacherApplications/${id}`, { status: 'rejected' })
      .subscribe({
        next: () => {
          this.getApplications();
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
}
