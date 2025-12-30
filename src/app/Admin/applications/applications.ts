import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { Student } from '../../interfaces/student';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-applications',
  imports: [AsyncPipe, FormsModule],
  templateUrl: './applications.html',
  styleUrl: './applications.scss',
})
export class Applications implements OnInit {
  private http = inject(HttpClient);
  private apli = new BehaviorSubject<Student[]>([]);
  protected apliObs = this.apli.asObservable();
  protected userDetail: any = {};
  protected searchVal: string = '';
  protected showMsg: boolean = false;

  ngOnInit(): void {
    this.getAppli();
    this.latestStudDetails();
    this.toApproveStudsEnd();
  }

  getAppli() {
    this.http.get<Student[]>('http://localhost:3000/apply').subscribe({
      next: (res) => {
        this.apli.next(res);
      },
    });
  }

  approve(id: string) {
    this.http
      .patch(`http://localhost:3000/apply/${id}`, { status: 'approved', semester: 1 })
      .subscribe({
        next: () => {
          this.getAppli();
          this.latestStudDetails();
        },
        error: (err) => {
          console.log('not patched', err);
        },
      });
  }
  reject(id: string) {
    this.http
      .patch(`http://localhost:3000/apply/${id}`, { status: 'rejected', semester: 0 })
      .subscribe({
        next: () => {
          this.getAppli();
          this.latestStudDetails();
        },
        error: (err) => {
          console.log('not patched', err);
        },
      });
  }
  details(id: string) {
    this.http.get<Student>(`http://localhost:3000/apply/${id}`).subscribe({
      next: (res) => {
        this.userDetail = res;
      },
    });
  }

  search() {
    const searxh = this.searchVal.toLowerCase();
    document.querySelectorAll('.all').forEach((find) => {
      let name = find.querySelector('.name')?.textContent.toLowerCase();
      let email = find.querySelector('.email')?.textContent.toLowerCase();

      if (name?.includes(searxh) || email?.includes(searxh)) {
        (find as HTMLElement).style.display = '';
        this.showMsg = false;
      } else {
        (find as HTMLElement).style.display = 'none';
        this.showMsg = true;
      }
    });
  }

  latestStudDetails() {
    this.http.get<Student[]>('http://localhost:3000/apply').subscribe({
      next: (res) => {
        const lastStud = res[res.length - 1];
        this.userDetail = lastStud;
      },
    });
  }

  toApproveStudsEnd() {
    this.http.get<Student[]>('http://localhost:3000/apply').subscribe({
      next: (response) => {
        const approved = response.filter((find) => find.status === 'approved');

        approved.forEach((element: Student) => {
          this.http.get<Student[]>('http://localhost:3000/approvedStuds').subscribe({
            next: (res) => {
              const existed = res.some((check) => check.id === element.id);

              if (existed) {
                return;
              } else {
                this.http.post('http://localhost:3000/approvedStuds', element).subscribe({
                  error: (err) => {
                    console.log(err);
                  },
                });
              }
            },
          });
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
