import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Student } from '../../interfaces/student';

export interface application {
  id: string;
  name: string;
  dept: string;
  date: string;
  title: string;
  details: string;
  applicationDate: string;
  status: string;
}

@Component({
  selector: 'app-application',
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './application.html',
  styleUrl: './application.scss',
})
export class Application implements OnInit {
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);
  protected applicationForm!: FormGroup;
  protected applicationsArr: application[] = [];
  protected showhide: boolean = false;
  private teacherId: string = '';
  ngOnInit(): void {
    this.formInit();
    this.getApplications();
    this.loggedIn();
  }

  toggleForm() {
    this.showhide = !this.showhide;
  }

  formInit() {
    this.applicationForm = this.fb.group({
      name: ['', Validators.required],
      dept: ['', Validators.required],
      date: ['', Validators.required],
      title: ['', Validators.required],
      details: ['', Validators.required],
    });
  }

  submitApplication() {
    const formVal = this.applicationForm.value;
    const newAppli = {
      id: this.teacherId,
      status: 'pending',
      applicationDate: new Date(Date.now()),
      ...formVal,
    };

    this.http.post('http://localhost:3000/teacherApplications', newAppli).subscribe({
      next: () => {
        this.applicationForm.reset();
      },
    });
  }

  getApplications() {
    this.http
      .get<application[]>(`http://localhost:3000/teacherApplications/${this.teacherId}`)
      .subscribe({
        next: (res) => {
          this.applicationsArr = res;
        },
      });
  }

  loggedIn() {
    this.http.get<any>('http://localhost:3000/auth').subscribe({
      next: (res) => {
        this.http.get<any[]>('http://localhost:3000/faculty').subscribe({
          next: (response) => {
            const loginTeacher = response.find(
              (check) => check.email === res.email && res.loggedIn === true
            );
            this.teacherId = loginTeacher.id;
          },
        });
      },
    });
  }
}
