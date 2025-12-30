import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Student } from '../interfaces/student';

@Component({
  selector: 'app-apply-now',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './apply-now.html',
  styleUrl: './apply-now.scss',
})
export class ApplyNow implements OnInit {
  applyForm!: FormGroup;
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);

  ngOnInit(): void {
    this.applyForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.minLength(11)]],
      program: ['', Validators.required],
      session: ['', Validators.required],
      message: [''],
      semester: [0],
    });
  }

  submitApplication() {
    const formVal = this.applyForm.value;

    this.http.get<Student[]>('http://localhost:3000/apply').subscribe({
      next: (res) => {
        const exists = res.find((finded) => finded.email === formVal.email);
        if (exists) {
          alert('user alreasy exists');
          return;
        }
        const student = { ...this.applyForm.value, status: 'pending', section: '' };
        this.http.post('http://localhost:3000/apply', student).subscribe({
          next: () => {
            this.applyForm.reset();
          },
          error: (err) => {
            console.log(err);
          },
        });
      },
    });
  }
}
