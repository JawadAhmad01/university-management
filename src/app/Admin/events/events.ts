import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

export interface event {
  id: string;
  title: string;
  venue: string;
  date: string;
  speguest?: string;
  time: string;
  class?: string;
  description: string;
}

@Component({
  selector: 'app-events',
  imports: [ReactiveFormsModule],
  templateUrl: './events.html',
  styleUrl: './events.scss',
})
export class Events implements OnInit {
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);
  protected eventForm!: FormGroup;
  protected eventsArr: event[] = [];
  protected showHide: boolean = false;
  ngOnInit(): void {
    this.formInit();
    this.getForm();
  }
  formInit() {
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      speguest: [''],
      venue: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      class: [''],
      description: [''],
    });
  }

  toggleForm() {
    this.showHide = !this.showHide;
  }

  submitForm() {
    this.http.post('http://localhost:3000/events', this.eventForm.value).subscribe({
      next: () => {
        this.eventForm.reset();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getForm() {
    this.http.get<event[]>('http://localhost:3000/events').subscribe({
      next: (res) => {
        this.eventsArr = res;
      },
    });
  }

  deletE(id: string) {
    this.http.delete(`http://localhost:3000/events/${id}`).subscribe({
      next: () => {
        this.getForm();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
