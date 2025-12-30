import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Student } from '../../interfaces/student';

interface Question {
  question: string;
  A: string;
  B: string;
  C: string;
  D: string;
  correctop: string;
}

interface quiz {
  id: string;
  quizTitle: string;
  course: string;
  section: string;
  semester: number;
  totMarks: number;
  timeLimit: number;
  dueDate: string;
  questions: Question[];
  program: string;
}

@Component({
  selector: 'app-quiz',
  imports: [DatePipe, ReactiveFormsModule, FormsModule],
  templateUrl: './quiz.html',
  styleUrls: ['./quiz.scss'],
})
export class Quiz implements OnInit {
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);

  protected quizForm!: FormGroup;
  protected quizArr: quiz[] = [];
  protected sections: string[] = ['A', 'B', 'C'];
  protected semesters = [1, 2, 3, 4, 5, 6, 7, 8];
  protected selectedSemester: number = 1;
  protected selectedSection: string = 'A';
  protected oneQesMarks: number = 0;
  protected allQuizResults: any[] = [];

  private findedQuiz: any = {};

  score = 0;
  showQuiz = false;
  selectedQuiz: quiz | null = null;

  ngOnInit(): void {
    this.initializeForm();
    this.loadQuizzes();
    this.getQuizResults();
  }

  initializeForm(): void {
    this.quizForm = this.fb.group({
      questions: this.fb.array([]),
    });
  }

  loadQuizzes(): void {
    this.http.get<quiz[]>('http://localhost:3000/quiz').subscribe({
      next: (quizzes) => {
        const sem = this.selectedSemester;
        this.quizArr = (quizzes || []).filter(
          (q) => q.semester === sem && q.section === this.selectedSection
        );
        this.resetQuizState();
      },
      error: (err) => {
        console.error('Failed to load quizzes', err);
      },
    });
  }

  resetQuizState(): void {
    this.showQuiz = false;
    this.selectedQuiz = null;
    this.score = 0;
    this.initializeForm();
  }

  selectQuiz(quiz: quiz): void {
    this.oneQesMarks = Number(quiz.totMarks / quiz.questions.length);
    console.log(this.oneQesMarks);
    this.http.get<any>('http://localhost:3000/auth').subscribe({
      next: (response) => {
        this.http.get<Student[]>('http://localhost:3000/approvedStuds').subscribe({
          next: (res) => {
            const findLoggedIn = res.find(
              (check) =>
                check.email === response.email &&
                response.loggedIn === true &&
                response.status === 'approved'
            );
            if (findLoggedIn) {
              this.http.get<any[]>('http://localhost:3000/quizResults').subscribe({
                next: (allStudResults) => {
                  const checkIfAlready = allStudResults.some(
                    (check) => check.id === findLoggedIn?.id && check.attempt === true
                  );

                  if (checkIfAlready) {
                    alert('already attempted');
                    return;
                  } else {
                    this.selectedQuiz = quiz;
                    this.findedQuiz = quiz;
                    this.buildQuestionForm();
                    this.showQuiz = true;
                  }
                },
              });
            }
          },
        });
      },
    });
    const delay = Number(quiz.timeLimit * 60 * 1000);

    setTimeout(() => {
      this.submitQuiz();
      this.resetQuizState();
    }, delay);

    const timeFrom = quiz.timeLimit * 60 * 1000 + Date.now();
    const timer = setInterval(() => {
      let distance = timeFrom - Date.now();
      if (distance <= 0) {
        this.submitQuiz();
        this.resetQuizState();
        clearInterval(timer);
        document.getElementById('time')!.innerHTML = '0min 0s';
        return;
      }
      const mins = Math.floor(distance / (1000 * 60));
      const secs = Math.floor((distance % (1000 * 60)) / 1000);
      document.getElementById('time')!.innerHTML = `${mins}min ${secs}s`;
    }, 1000);
  }

  buildQuestionForm(): void {
    const arr = this.quizQuestionsToFormArray(this.selectedQuiz?.questions || []);
    this.quizForm.setControl('questions', arr);
  }

  get questions(): FormArray {
    return this.quizForm.get('questions') as FormArray;
  }

  submitQuiz(): void {
    if (!this.selectedQuiz || this.quizForm.invalid) return;

    const answers = this.questions.value;
    console.log(this.score);

    this.selectedQuiz.questions.forEach((qes, index) => {
      if (answers[index] && answers[index].answer === qes.correctop) {
        this.score += this.oneQesMarks;
      }
    });
    this.quizResultsToEndPoint();
  }

  goBack(): void {
    this.resetQuizState();
  }

  quizQuestionsToFormArray(questions: Question[]): FormArray {
    const groups = questions.map(() =>
      this.fb.group({
        answer: ['No'],
      })
    );
    return this.fb.array(groups);
  }

  quizResultsToEndPoint() {
    this.http.get<any>('http://localhost:3000/auth').subscribe({
      next: (response) => {
        this.http.get<Student[]>('http://localhost:3000/approvedStuds').subscribe({
          next: (res) => {
            const findLoggedIn = res.find(
              (check) => check.email === response.email && response.status === 'approved'
            );
            const studResult = {
              subject: this.findedQuiz.quizTitle,
              totalMarks: this.findedQuiz.totMarks,
              name: findLoggedIn?.fullName,
              id: findLoggedIn?.id,
              score: this.score,
              attempt: true,
            };

            this.http.post('http://localhost:3000/quizResults', studResult).subscribe({
              next: () => {
                this.resetQuizState();
              },
              error: (err) => {
                console.log(err);
              },
            });
          },
        });
      },
    });
  }

  getQuizResults() {
    this.http.get<any>('http://localhost:3000/auth').subscribe({
      next: (response) => {
        this.http.get<Student[]>('http://localhost:3000/approvedStuds').subscribe({
          next: (res) => {
            const loggedIn = res.find(
              (check) =>
                check.email === response.email &&
                response.loggedIn === true &&
                response.status === 'approved'
            );

            this.http.get<any[]>(`http://localhost:3000/quizResults`).subscribe({
              next: (studRes) => {
                const results = studRes.filter((find) => find.id === loggedIn?.id);

                if (results) {
                  this.allQuizResults = results;
                } else {
                  this.allQuizResults = [];
                }
              },
            });
          },
        });
      },
    });
  }
}
