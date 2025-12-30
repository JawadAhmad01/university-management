import { HttpClient, httpResource } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormBuilder, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-quiz',
  imports: [ReactiveFormsModule],
  templateUrl: './quiz.html',
  styleUrl: './quiz.scss',
})
export class Quiz implements OnInit {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  protected quizFrom!: FormGroup;

  ngOnInit(): void {
    this.createForm();
    this.addQuestion();
  }

  createForm() {
    this.quizFrom = this.fb.group({
      quizTitle: ['', Validators.required],
      semester: ['', Validators.required],
      section: ['', Validators.required],
      course: ['', Validators.required],
      totMarks: ['', Validators.required],
      timeLimit: ['', Validators.required],
      dueDate: ['', Validators.required],
      questions: this.fb.array([]),
    });
  }

  get questions(): FormArray {
    return this.quizFrom.get('questions') as FormArray;
  }

  newQuestion(): FormGroup {
    return this.fb.group({
      question: ['', Validators.required],
      A: ['', Validators.required],
      B: ['', Validators.required],
      C: ['', Validators.required],
      D: ['', Validators.required],
      correctop: ['', Validators.required],
    });
  }

  addQuestion() {
    this.questions.push(this.newQuestion());
  }
  removeQuestion(index: number) {
    this.questions.removeAt(index);
  }
  submitQuizForm() {
    const formVal = this.quizFrom.value;
    this.http.post<any>('http://localhost:3000/quiz', formVal).subscribe({
      next: (res) => {
        const id = res.id;
        this.quizFrom.reset();
        const Due = new Date(formVal.dueDate);
        const delay = Due.getTime() - Date.now();
        setTimeout(() => {
          this.http.delete(`http://localhost:3000/quiz/${id}`).subscribe({
            error: (err) => {
              console.log(err);
            },
          });
        }, delay);
      },
    });
  }
}
