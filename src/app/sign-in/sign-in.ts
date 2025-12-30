import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Signin } from '../interfaces/signin';
import { Student } from '../interfaces/student';

@Component({
  selector: 'app-sign-in',
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.scss',
})
export class SignIn {
  private router = inject(Router);
  private http = inject(HttpClient);
  signInForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }
  onSubmit() {
    const { email, password } = this.signInForm.value;

    this.http.get<Signin[]>('http://localhost:3000/users').subscribe({
      next: (res) => {
        const findUser = res.find(
          (finded) => finded.email === email && finded.password === password
        );

        if (!findUser) {
          alert('plz sign-up');
          return;
        }
        if (findUser.role === 'teacher') {
          this.http
            .put('http://localhost:3000/auth', {
              loggedIn: true,
              id: findUser.id,
              role: findUser.role,
              email: findUser.email,
            })
            .subscribe({
              next: () => {
                this.signInForm.reset();
                this.router.navigateByUrl('/teachers');
                return;
              },
            });
        } else if (findUser.role === 'admin') {
          this.http
            .put('http://localhost:3000/auth', {
              loggedIn: true,
              id: findUser.id,
              role: findUser.role,
              email: findUser.email,
            })
            .subscribe({
              next: () => {
                this.signInForm.reset();
                this.router.navigateByUrl('/admin');
                return;
              },
            });
        } else {
          const params = new HttpParams().set('email', email);

          this.http.get<Student[]>('http://localhost:3000/apply', { params }).subscribe({
            next: (res) => {
              const approved = res.find((finded) => finded.status === 'approved');
              if (!approved) {
                alert('student not approved by admin');
                return;
              }
              this.http
                .put('http://localhost:3000/auth', {
                  loggedIn: true,
                  id: findUser.id,
                  role: findUser.role,
                  status: approved?.status,
                  email: findUser.email,
                })
                .subscribe({
                  next: () => {
                    this.signInForm.reset();
                    this.router.navigateByUrl('/student');
                  },
                });
            },
          });
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
