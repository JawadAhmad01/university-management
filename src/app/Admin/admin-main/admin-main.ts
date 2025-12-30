import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Student } from '../../interfaces/student';
import { course } from '../../interfaces/course';
import { faculty } from '../../interfaces/faculty';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-main',
  imports: [ReactiveFormsModule, CommonModule, RouterLink, DatePipe],
  templateUrl: './admin-main.html',
  styleUrl: './admin-main.scss',
})
export class AdminMain implements OnInit {
  private http = inject(HttpClient);
  protected noticeForm!: FormGroup;
  protected approvedStuds: number = 0;
  protected applicants: number = 0;
  protected totalCorses: number = 0;
  protected totalFaculty: number = 0;
  protected latestNotices: any[] = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.noticeForm = this.fb.group({
      title: ['', Validators.required],
      message: ['', Validators.required],
    });
    this.showTotal();
    this.getLatestNotices();
  }

  postNotice() {
    if (this.noticeForm.invalid) {
      return;
    }
    const submitNotices = { ...this.noticeForm.value, date: Date.now() };
    this.http.post('http://localhost:3000/notices', submitNotices).subscribe({
      next: () => {
        this.noticeForm.reset();
        this.getLatestNotices();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  showTotal() {
    this.http.get<Student[]>('http://localhost:3000/apply').subscribe({
      next: (res) => {
        this.applicants = res.length;
        const approved = res.filter((finded) => finded.status === 'approved');
        this.approvedStuds = approved.length;
      },
    });

    this.http.get<course[]>('http://localhost:3000/courses').subscribe((res) => {
      this.totalCorses = res.length;
    });

    this.http.get<faculty[]>('http://localhost:3000/faculty').subscribe({
      next: (res) => {
        this.totalFaculty = res.length;
      },
    });
  }

  getLatestNotices() {
    this.http.get<any[]>('http://localhost:3000/notices').subscribe({
      next: (res) => {
        if (res.length <= 3) {
          this.latestNotices = res;
        } else {
          const last3Notices = res.slice(res.length - 3, res.length);
          this.latestNotices = last3Notices;
        }
      },
    });
  }
  deleteNotice(id: string) {
    this.http.delete<any[]>(`http://localhost:3000/notices/${id}`).subscribe({
      next: () => {
        this.getLatestNotices();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
