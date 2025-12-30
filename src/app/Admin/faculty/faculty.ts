import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { faculty } from '../../interfaces/faculty';
import { filter } from 'rxjs';
import { Signin } from '../../interfaces/signin';

@Component({
  selector: 'app-faculty',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './faculty.html',
  styleUrl: './faculty.scss',
})
export class Faculty implements OnInit {
  protected addFacuty!: FormGroup;
  protected toggleForm: boolean = false;
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  protected facultyArr: faculty[] = [];
  protected filterArr: faculty[] = [];
  protected facultyDetails: any = {};
  protected editFacultyForm!: FormGroup;
  private idToEdit: string = '';
  protected searchVal: string = '';
  protected filterVal: string = 'All';
  protected showMsg: boolean = false;

  ngOnInit() {
    this.facultyForm();
    this.getFacultyMembers();
    this.editFacultyForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      department: ['', Validators.required],
      designation: ['', Validators.required],
      empType: ['', Validators.required],
      status: ['', Validators.required],
    });
  }

  facultyForm() {
    this.addFacuty = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      department: ['', Validators.required],
      designation: ['', Validators.required],
      empType: ['', Validators.required],
      status: ['', Validators.required],
    });
  }

  submitFacForm() {
    this.http
      .put(`http://localhost:3000/faculty/${this.idToEdit}`, this.editFacultyForm.value)
      .subscribe({
        next: () => {
          this.editFacultyForm.reset();

          this.getFacultyMembers();
        },
        error: (err) => {
          console.log('form not updated', err);
        },
      });
  }
  showForm() {
    this.toggleForm = !this.toggleForm;
  }
  submitForm() {
    this.http.post('http://localhost:3000/faculty', this.addFacuty.value).subscribe({
      next: () => {
        this.addFacuty.reset();
      },
      error: (err) => {
        console.log('not submited', err);
      },
    });
  }

  getFacultyMembers() {
    this.http.get<faculty[]>('http://localhost:3000/faculty').subscribe({
      next: (res) => {
        this.facultyArr = res;
        this.filterArr = res;
      },
      error: (err) => {
        console.log('getFacultyMembers failed', err);
      },
    });
  }
  editFaculty(id: string) {
    this.http.get<faculty>(`http://localhost:3000/faculty/${id}`).subscribe({
      next: (res) => {
        this.editFacultyForm.patchValue({
          id: res.id,
          name: res.name,
          email: res.email,
          phone: res.phone,
          department: res.department,
          designation: res.designation,
          empType: res.empType,
          status: res.status,
        });

        this.idToEdit = res.id;
      },
    });
  }

  search() {
    const value = this.searchVal.toLowerCase();
    document.querySelectorAll('.all').forEach((find) => {
      const name = find.querySelector('.name')?.textContent.toLowerCase();
      const email = find.querySelector('.email')?.textContent.toLowerCase();

      if (name?.includes(value) || email?.includes(value)) {
        (find as HTMLElement).style.display = '';
        this.showMsg = false;
      } else {
        (find as HTMLElement).style.display = 'none';
        this.showMsg = true;
      }
    });
  }
  filterActiveInActive() {
    if (this.filterVal === 'All') {
      this.filterArr = this.facultyArr;
    } else {
      this.filterArr = this.facultyArr.filter((find) => find.status === this.filterVal);
    }
  }

  inActive(id: string) {
    this.http.patch(`http://localhost:3000/faculty/${id}`, { status: 'InActive' }).subscribe({
      next: () => {
        this.getFacultyMembers();
      },
      error: (err) => {
        console.log('status inActive failed', err);
      },
    });
  }

  active(id: string) {
    this.http.patch<any>(`http://localhost:3000/faculty/${id}`, { status: 'Active' }).subscribe({
      next: (res) => {
        this.getFacultyMembers();
        const activeTeachEmail = res.email;
        this.http.get<Signin[]>('http://localhost:3000/users').subscribe({
          next: (res) => {
            const findTeacher = res.find((teach) => teach.email === activeTeachEmail);

            if (!findTeacher) {
              return;
            }
            this.http
              .patch(`http://localhost:3000/users/${findTeacher.id}`, { role: 'teacher' })
              .subscribe({
                error: (err) => {
                  console.log(err);
                },
              });
          },
        });
      },
      error: (err) => {
        console.log('status active failed', err);
      },
    });
  }
}
