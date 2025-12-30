import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Student } from '../../interfaces/student';
import { attenance } from '../../interfaces/attendance';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-attendence',
  imports: [NgClass],
  templateUrl: './attendence.html',
  styleUrls: ['./attendence.scss'],
})
export class Attendence implements OnInit {
  private http = inject(HttpClient);
  private loggedInStudentId: string | undefined = '';

  protected studAtendanceArr: any[] = [];
  protected totalClasses: number = 0;
  protected totalPresents: number = 0;
  protected totalAbsents: number = 0;
  protected subjectInfoArr: attenance[] = [];

  ngOnInit(): void {
    this.findLoggedIn();
  }

  getAttendance() {
    this.http.get<attenance[]>('http://localhost:3000/attendance').subscribe({
      next: (response) => {
        const subjectsMap: any = {};

        response.forEach((item) => {
          const subject = item.subject;

          if (!subjectsMap[subject]) {
            subjectsMap[subject] = {
              subject: subject,
              totalClasses: 0,
              attended: 0,
              absent: 0,
            };
          }

          const studentRecord = item.attendance.find(
            (att: any) => att.studentId === this.loggedInStudentId
          );

          if (studentRecord) {
            subjectsMap[subject].totalClasses += 1;

            if (studentRecord.status === 'present') {
              subjectsMap[subject].attended += 1;
              this.totalPresents += 1;
            } else {
              subjectsMap[subject].absent += 1;
              this.totalAbsents += 1;
            }
          }
        });

        this.studAtendanceArr = Object.values(subjectsMap);
        this.totalClasses = response.length;
      },
    });
  }

  findLoggedIn() {
    this.http.get<any>('http://localhost:3000/auth').subscribe({
      next: (authResp) => {
        this.http.get<Student[]>('http://localhost:3000/approvedStuds').subscribe({
          next: (res) => {
            const LoggedIn = res.find(
              (check) => check.email === authResp.email && authResp.loggedIn === true
            );
            this.loggedInStudentId = LoggedIn?.id;

            if (this.loggedInStudentId) {
              this.getAttendance();
            }
          },
        });
      },
    });
  }
}
