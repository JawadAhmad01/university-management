import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Signin } from '../interfaces/signin';

@Component({
  selector: 'app-sign-up',
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.scss',
})
export class SignUp {
  private router = inject(Router);
  private http = inject(HttpClient);
  signUpForm: FormGroup;
  constructor(private fb: FormBuilder) {
    this.signUpForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    const formVal = this.signUpForm.value;

    this.http.get<Signin[]>('http://localhost:3000/users').subscribe((res) => {
      const existed = res.find((finded) => finded.email === formVal.email);
      if (existed) {
        alert('email already existed');
        return;
      }
      const user = {
        email: formVal.email,
        password: formVal.password,
        role: 'student',
      };

      this.http.post('http://localhost:3000/users', user).subscribe({
        next: () => {
          this.signUpForm.reset();
          this.router.navigateByUrl('/signin');
        },
        error: (err) => {
          console.log(err);
        },
      });
    });
  }
}
