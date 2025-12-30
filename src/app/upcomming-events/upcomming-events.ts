import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { event } from '../Admin/events/events';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-upcomming-events',
  imports: [DatePipe],
  templateUrl: './upcomming-events.html',
  styleUrl: './upcomming-events.scss',
})
export class UpcommingEvents implements OnInit {
  private http = inject(HttpClient);
  protected eventsArr: event[] = [];

  ngOnInit(): void {
    this.getEvents();
  }

  getEvents() {
    this.http.get<event[]>('http://localhost:3000/events').subscribe({
      next: (res) => {
        this.eventsArr = res;
      },
    });
  }
}
