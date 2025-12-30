import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Student } from '../../interfaces/student';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  FormArray,
} from '@angular/forms';
import { course } from '../../interfaces/course';

@Component({
  selector: 'app-mark-attendence',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './mark-attendence.html',
  styleUrl: './mark-attendence.scss',
})
export class MarkAttendence implements OnInit {
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);
  protected attendanceFrom!: FormGroup;
  protected programs: course[] = [];
  protected programVal: string = 'BSCS';
  protected semArr: number[] = [1, 2, 3, 4, 5, 6, 7, 8];
  protected semVal: number = 1;
  protected sectionArr: string[] = ['A', 'B', 'C'];
  protected sectionVal: string = 'A';
  protected approvedStuds: Student[] = [];
  protected searchTerm: string = '';

  ngOnInit(): void {
    this.form();
    this.getPrograms();
    this.getStudents();
  }

  form() {
    this.attendanceFrom = this.fb.group({
      subject: ['', Validators.required],
      attendance: this.fb.array([]),
    });
  }

  get attendance(): FormArray {
    return this.attendanceFrom.get('attendance') as FormArray;
  }

  createAttendanceGroup(student: Student) {
    return this.fb.group({
      studentId: [student.id],
      fullName: [student.fullName],
      status: ['present', Validators.required],
    });
  }

  getStudents() {
    this.http.get<Student[]>('http://localhost:3000/approvedStuds').subscribe({
      next: (res) => {
        const singleClass = res.filter(
          (find) =>
            find.semester === Number(this.semVal) &&
            find.program === this.programVal &&
            find.section === this.sectionVal
        );

        this.attendance.clear();

        this.approvedStuds = singleClass;

        this.approvedStuds.forEach((student) => {
          this.attendance.push(this.createAttendanceGroup(student));
        });
      },
      error: (err) => {
        console.error('Error fetching students:', err);
      },
    });
  }

  getPrograms() {
    this.http.get<course[]>('http://localhost:3000/courses').subscribe({
      next: (res) => {
        this.programs = res;
      },
      error: (err) => {
        console.error('Error fetching programs:', err);
      },
    });
  }

  get presentCount(): number {
    return this.attendance.controls.filter((find) => find.get('status')?.value === 'present')
      .length;
  }

  get absentCount(): number {
    return this.attendance.controls.filter((find) => find.get('status')?.value === 'absent').length;
  }

  get filteredStudents(): Student[] {
    if (!this.searchTerm) {
      return this.approvedStuds;
    }
    const term = this.searchTerm.toLowerCase();
    return this.approvedStuds.filter(
      (student) =>
        student.fullName.toLowerCase().includes(term) || student.id.toString().includes(term)
    );
  }

  submitAttendance() {
    if (this.attendanceFrom.invalid) {
      alert('Please fill in all required fields');
      return;
    }
    const formVal = this.attendanceFrom.value;

    const attendanceData = {
      subject: formVal.subject,
      program: this.programVal,
      section: this.sectionVal,
      semester: this.semVal,
      date: new Date().toLocaleDateString(),
      attendance: formVal.attendance,
    };
    this.http.get<any[]>('http://localhost:3000/attendance').subscribe((response) => {
      const checkinDb = response.some(
        (find: any) => find.date === attendanceData.date && find.subject === attendanceData.subject
      );
      if (checkinDb) {
        alert('attendance already marked for this subject');
        return;
      }

      this.http.post('http://localhost:3000/attendance', attendanceData).subscribe({
        next: () => {
          this.attendanceFrom.reset();
          this.getStudents();
        },
        error: (err) => {
          console.error('Error submitting', err);
        },
      });
    });
  }

  markAllPresent() {
    this.attendance.controls.forEach((control) => {
      control.patchValue({ status: 'present' });
    });
  }

  markAllAbsent() {
    this.attendance.controls.forEach((control) => {
      control.patchValue({ status: 'absent' });
    });
  }
}
