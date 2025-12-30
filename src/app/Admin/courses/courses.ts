import { Component, OnInit, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
  FormsModule,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { course } from '../../interfaces/course';

@Component({
  selector: 'app-courses',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './courses.html',
  styleUrl: './courses.scss',
})
export class Courses implements OnInit {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  protected newCourse!: FormGroup;
  protected courses: course[] = [];
  protected searchVal: string = '';
  protected showVouchBTN: boolean = false;

  ngOnInit(): void {
    this.newCourse = this.fb.group({
      courseCode: ['', Validators.required],
      title: ['', Validators.required],
      duration: ['', Validators.required],
      credits: ['', Validators.required],
    });
    this.coursesList();
  }

  onSubmit() {
    const formVal = this.newCourse.value;
    const newcourse = {
      ...formVal,
      status: 'active',
      id: formVal.courseCode,
    };
    console.log(newcourse);
    this.http.post('http://localhost:3000/courses', newcourse).subscribe(() => {
      this.newCourse.reset();
      this.coursesList();
    });
  }

  coursesList() {
    this.http.get<course[]>('http://localhost:3000/courses').subscribe({
      next: (res) => {
        this.courses = res;
      },
    });
  }

  deActive(courseId: string) {
    this.http
      .patch<course>(`http://localhost:3000/courses/${courseId}`, { status: 'deActive' })
      .subscribe({
        next: () => {
          this.coursesList();
        },
        error: (err) => {
          console.log('not deActivated', err);
        },
      });
  }
  active(courseId: string) {
    this.http
      .patch<course>(`http://localhost:3000/courses/${courseId}`, { status: 'active' })
      .subscribe({
        next: () => {
          this.coursesList();
        },
        error: (err) => {
          console.log('not activated', err);
        },
      });
  }

  delete(courseId: string) {
    this.http.delete<course>(`http://localhost:3000/courses/${courseId}`).subscribe({
      next: () => {
        this.coursesList();
      },
      error: (err) => {
        console.log('deletion failed', err);
      },
    });
  }

  search() {
    const value = this.searchVal.toLowerCase();
    document.querySelectorAll('.all').forEach((find) => {
      let title = find.querySelector('.title')?.textContent.toLowerCase();
      let courseCode = find.querySelector('.corseCode')?.textContent.toLowerCase();

      if (title?.includes(value) || courseCode?.includes(value)) {
        (find as HTMLElement).style.display = '';
        this.showVouchBTN = false;
      } else {
        (find as HTMLElement).style.display = 'none';
        this.showVouchBTN = true;
      }
    });
  }
}
