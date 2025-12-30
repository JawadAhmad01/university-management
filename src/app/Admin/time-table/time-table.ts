import { Component, inject, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  FormsModule,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { timetable } from '../../interfaces/timetable';

@Component({
  selector: 'app-time-table',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './time-table.html',
  styleUrl: './time-table.scss',
})
export class TimeTable implements OnInit {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  protected newtimeTableForm!: FormGroup;
  protected editform!: FormGroup;
  protected showHideFormBtn: boolean = false;
  protected timetableArr: any[] = [];
  editopen: boolean = true;
  protected searchVal: string = '';
  protected errorMsg: boolean = false;

  ngOnInit(): void {
    this.newtimeTableForm = this.fb.group({
      instructor: ['', Validators.required],
      days: this.fb.array([]),
    });
    this.editform = this.fb.group({
      instructor1: ['', Validators.required],
      days: this.fb.array([]),
    });

    this.addewDayData();
    this.getTimeTable();
  }

  get days(): FormArray {
    return this.newtimeTableForm.get('days') as FormArray;
  }
  get editDays(): FormArray {
    return this.editform.get('days') as FormArray;
  }

  newdayData(data?: any): FormGroup {
    return this.fb.group({
      id: [data?.id || String(Date.now())],
      day: [data?.day || 'Monday', Validators.required],
      time: [data?.time || '08:00 - 09:00', Validators.required],
      room: [data?.room || '', Validators.required],
      course: [data?.course || '', Validators.required],
      semester: [data?.semester || '', Validators.required],
      section: [data?.section || '', Validators.required],
      class: [data?.class || '', Validators.required],
      action: [data?.action || 'Lecture', Validators.required],
    });
  }
  getLecturesByDay(days: any[], day: string) {
    return days.filter((d) => d.day === day);
  }
  addewDayData() {
    this.days.push(this.newdayData());
  }
  addewDayDataedit() {
    this.editDays.push(this.editDayGroup());
  }
  editDayGroup(data?: any): FormGroup {
    return this.fb.group({
      id: [data?.id],
      day1: [data?.day, Validators.required],
      time1: [data?.time, Validators.required],
      room1: [data?.room, Validators.required],
      course1: [data?.course || '', Validators.required],
      semester1: [data?.semester || '', Validators.required],
      section1: [data?.section || '', Validators.required],
      class1: [data?.class || '', Validators.required],
      action1: [data?.action || 'Lecture', Validators.required],
    });
  }

  deleteDayData(index: number) {
    this.days.removeAt(index);
  }
  deleteDayDataedit(index: number) {
    this.editDays.removeAt(index);
  }

  toggleform() {
    this.showHideFormBtn = true;
  }

  toggleEditForm() {
    this.showHideFormBtn = false;
  }
  newFormSubmit() {
    let formValue = this.newtimeTableForm.value;
    this.http.post('http://localhost:3000/timeTable', formValue).subscribe({
      next: () => {
        this.newtimeTableForm.reset();
      },
      error: (err) => {
        console.log('form not submitted', err);
      },
    });
  }
  getTimeTable() {
    this.http.get<timetable[]>('http://localhost:3000/timeTable').subscribe({
      next: (res) => {
        this.timetableArr = res;
      },
      error: (err) => {
        console.log('getTimeTable failed', err);
      },
    });
  }
  del(id: string) {
    this.http.delete(`http://localhost:3000/timeTable/${id}`).subscribe(() => {
      this.getTimeTable();
    });
  }
  dellec(lecid: string, tableid: string) {
    this.http.get(`http://localhost:3000/timeTable/${tableid}`).subscribe((table: any) => {
      let day = table.days;
      let delet = day.filter((f: any) => f.id !== lecid);

      this.http
        .patch(`http://localhost:3000/timeTable/${tableid}`, { days: delet })
        .subscribe(() => {
          this.getTimeTable();
        });
    });
  }
  editid: any;
  edit(timetable: any) {
    this.editopen = false;
    this.showHideFormBtn = true;
    this.editid = timetable.id;

    this.editform.patchValue({
      course1: timetable.course,
      semester1: timetable.semester,
      instructor1: timetable.instructor,
    });

    this.editDays.clear();
    timetable.days.forEach((lec: any) => {
      this.editDays.push(this.editDayGroup(lec));
    });
  }

  editformload() {
    this.editform = this.fb.group({});
  }
  editsubmit() {
    if (this.editform.invalid) return;

    const formValue = this.editform.value;

    const updatedData = {
      course: formValue.course1,
      semester: formValue.semester1,
      instructor: formValue.instructor1,
      days: formValue.days.map((d: any) => ({
        id: d.id,
        day: d.day1,
        time: d.time1,
        room: d.room1,
      })),
    };

    this.http.patch(`http://localhost:3000/timeTable/${this.editid}`, updatedData).subscribe(() => {
      this.getTimeTable();
      this.editform.reset();
      this.editDays.clear();
      this.showHideFormBtn = false;
    });
  }
  search() {
    document.querySelectorAll('.all').forEach((fac) => {
      let name = fac.querySelector('.name')?.textContent.toLowerCase();
      if (name?.includes(this.searchVal)) {
        (fac as HTMLElement).style.display = '';
        this.errorMsg = false;
      } else {
        (fac as HTMLElement).style.display = 'none';
        this.errorMsg = true;
      }
    });
  }
}
