import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

interface Lecture {
  day: string;
  time: string;
  course: string;
  instructor: string;
  room: string;
  class: string;
  section: string;
}

interface ClassSection {
  class: string;
  section: string;
  lectures: Lecture[];
}

@Component({
  selector: 'app-lectures',
  imports: [FormsModule],
  templateUrl: './lectures.html',
  styleUrl: './lectures.scss',
})
export class Lectures implements OnInit {
  days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  timeSlots = ['08:00 - 09:00', '09:00 - 10:00', '10:30 - 11:00', '11:30 - 12:00', '14:00 - 15:30'];

  classSections: ClassSection[] = [];
  searchQuery: string = '';
  selectedMainClass: string = 'All';
  mainClasses = ['All', 'Ics', 'Engineering', 'Medical'];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any>('http://localhost:3000/timeTable').subscribe((res) => {
      const data = res.timeTable ?? res;
      const tempClassSections: ClassSection[] = [];

      data.forEach((teacher: any) => {
        teacher.days.forEach((d: any) => {
          let cs = tempClassSections.find((c) => c.class === d.class && c.section === d.section);
          if (!cs) {
            cs = { class: d.class, section: d.section, lectures: [] };
            tempClassSections.push(cs);
          }
          cs.lectures.push({
            day: d.day,
            time: d.time,
            course: d.course,
            instructor: teacher.instructor,
            room: d.room,
            class: d.class,
            section: d.section,
          });
        });
      });

      this.classSections = tempClassSections;
    });
  }

  getCell(cs: ClassSection, day: string, time: string) {
    return cs.lectures.find((l) => l.day === day && l.time === time);
  }

  filterClassSections(): ClassSection[] {
    return this.classSections.filter((cs) => {
      const matchesClass = this.selectedMainClass === 'All' || cs.class === this.selectedMainClass;
      const matchesSearch =
        cs.section.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        cs.class.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchesClass && matchesSearch;
    });
  }
}
