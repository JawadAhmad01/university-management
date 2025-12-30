import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-student-main',
  imports: [CommonModule, AsyncPipe, DatePipe],
  templateUrl: './student-main.html',
  styleUrl: './student-main.scss',
})
export class StudentMain implements OnInit {
  private http = inject(HttpClient);
  private notice = new BehaviorSubject<any[]>([]);
  protected noticeObs = this.notice.asObservable();

  ngOnInit(): void {
    this.loadNotices();
  }

  loadNotices() {
    this.http.get<any[]>('http://localhost:3000/notices').subscribe({
      next: (res) => {
        const last3Notices = res.slice(res.length - 3, res.length);
        this.notice.next(last3Notices);
      },
    });
  }
}
