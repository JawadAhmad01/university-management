import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Student } from '../../interfaces/student';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-all-studs',
  imports: [FormsModule],
  templateUrl: './all-studs.html',
  styleUrl: './all-studs.scss',
})
export class AllStuds implements OnInit {
  private http = inject(HttpClient);
  protected allStudents: Student[] = [];
  protected sectionsArr: string[] = ['A', 'B', 'C'];
  protected secVal: string = 'A';
  protected semArr: number[] = [1, 2, 3, 4, 5, 6, 7, 8];
  protected semVal: number = 1;

  ngOnInit(): void {
    this.approvedStuds();
  }

  approvedStuds() {
    this.http.get<Student[]>('http://localhost:3000/approvedStuds').subscribe({
      next: (res) => {
        this.allStudents = res;
      },
    });
  }

  delete(id: string) {
    this.http.delete(`http://localhost:3000/apply/${id}`).subscribe({
      next: () => {
        this.approvedStuds();
      },
      error: (error) => {
        console.log('student not deleted', error);
      },
    });
  }
  setSection(id: string) {
    this.http
      .patch(`http://localhost:3000/approvedStuds/${id}`, { section: this.secVal })
      .subscribe({
        error: (err) => {
          console.log('section ot set', err);
        },
      });
  }
  setSemester(id: string) {
    this.http
      .patch(`http://localhost:3000/approvedStuds/${id}`, { semester: Number(this.semVal) })
      .subscribe({
        error: (err) => {
          console.log('section ot set', err);
        },
      });
  }
}
