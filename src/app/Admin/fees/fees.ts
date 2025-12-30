import { Component, inject, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
  FormsModule,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Student } from '../../interfaces/student';

@Component({
  selector: 'app-fees',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './fees.html',
  styleUrl: './fees.scss',
})
export class Fees implements OnInit {
  protected feeForm!: FormGroup;
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  protected showHideBtn: boolean = false;
  protected voucherList: any[] = [];
  protected searchVal: string = '';
  protected showForm: boolean = false;
  protected studentsArr: Student[] = [];
  protected showMsg: boolean = false;

  ngOnInit(): void {
    this.getVouchersList();
    this.getAppStudents();
    this.feeForm = this.fb.group({
      program: ['', Validators.required],
      semester: ['', Validators.required],
      section: ['', Validators.required],
      date: ['', Validators.required],
      title: ['', Validators.required],
      amount: ['', Validators.required],
      student: ['', Validators.required],
      message: [''],
    });
  }

  getAppStudents() {
    this.http.get<Student[]>('http://localhost:3000/apply').subscribe({
      next: (res) => {
        const filter = res.filter((find) => find.status === 'approved');
        this.studentsArr = filter;
      },
    });
  }

  toggleForm() {
    this.showForm = !this.showForm;
  }

  getVouchersList() {
    this.http.get<any[]>('http://localhost:3000/fees').subscribe({
      next: (res) => {
        this.voucherList = res;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  onFormSubmit() {
    this.http.post('http://localhost:3000/fees', this.feeForm.value).subscribe({
      next: () => {
        this.feeForm.reset();
      },
      error: (err) => {
        console.log('voucher is not posted', err);
      },
    });
  }

  searchVoucher() {
    const value = this.searchVal.toLowerCase();
    document.querySelectorAll('.all').forEach((element) => {
      const byId = element.querySelector('.id')?.textContent.toLowerCase();
      const byProgram = element.querySelector('.program')?.textContent.toLowerCase();
      if (byId?.includes(value) || byProgram?.includes(value)) {
        (element as HTMLElement).style.display = '';
        this.showMsg = false;
      } else {
        (element as HTMLElement).style.display = 'none';
        this.showMsg = true;
      }
    });
  }
}
