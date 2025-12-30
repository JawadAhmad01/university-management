import { Routes } from '@angular/router';
import { studGardGuard } from './guards/stud-gard-guard';
import { adminGuard } from './guards/admin-guard';
import { teacherGuard } from './Teachers/teacher-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./nav/nav').then((x) => x.Nav),
    children: [
      {
        path: '',
        loadComponent: () => import('./main-page/main-page').then((x) => x.MainPage),
      },

      {
        path: 'about',
        loadComponent: () => import('./about/about').then((x) => x.About),
      },
      {
        path: 'contact',
        loadComponent: () => import('./contact/contact').then((x) => x.Contact),
      },
      {
        path: 'admissions',
        loadComponent: () => import('./admissions/admissions').then((x) => x.Admissions),
      },
      {
        path: 'faculty',
        loadComponent: () => import('./faculties/faculties').then((x) => x.Faculties),
      },
      {
        path: 'apply',
        loadComponent: () => import('./apply-now/apply-now').then((x) => x.ApplyNow),
      },
      {
        path: 'events',
        loadComponent: () =>
          import('./upcomming-events/upcomming-events').then((x) => x.UpcommingEvents),
      },
    ],
  },

  {
    path: 'signin',
    loadComponent: () => import('./sign-in/sign-in').then((x) => x.SignIn),
  },
  {
    path: 'signup',
    loadComponent: () => import('./sign-up/sign-up').then((x) => x.SignUp),
  },
  {
    path: 'student',
    loadComponent: () => import('./student/aside/aside').then((x) => x.Aside),
    canActivate: [studGardGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./student/student-main/student-main').then((x) => x.StudentMain),
      },
      {
        path: 'attendence',
        loadComponent: () => import('./student/attendence/attendence').then((x) => x.Attendence),
      },
      {
        path: 'fee',
        loadComponent: () => import('./student/pay-fee/pay-fee').then((x) => x.PayFee),
      },
      {
        path: 'lectures',
        loadComponent: () => import('./student/lectures/lectures').then((x) => x.Lectures),
      },
      {
        path: 'quiz',
        loadComponent: () => import('./student/quiz/quiz').then((x) => x.Quiz),
      },
    ],
  },
  {
    path: 'admin',
    loadComponent: () => import('./Admin/admin-nav/admin-nav').then((x) => x.AdminNav),
    canActivate: [adminGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./Admin/admin-main/admin-main').then((x) => x.AdminMain),
      },
      {
        path: 'applications',
        loadComponent: () =>
          import('./Admin/applications/applications').then((x) => x.Applications),
      },
      {
        path: 'techerapplications',
        loadComponent: () =>
          import('./Admin/teachers-appli/teachers-appli').then((x) => x.TeachersAppli),
      },
      {
        path: 'events',
        loadComponent: () => import('./Admin/events/events').then((x) => x.Events),
      },
      {
        path: 'allstudents',
        loadComponent: () => import('./Admin/all-studs/all-studs').then((x) => x.AllStuds),
      },
      {
        path: 'courses',
        loadComponent: () => import('./Admin/courses/courses').then((x) => x.Courses),
      },
      {
        path: 'faculty',
        loadComponent: () => import('./Admin/faculty/faculty').then((x) => x.Faculty),
      },
      {
        path: 'timetable',
        loadComponent: () => import('./Admin/time-table/time-table').then((x) => x.TimeTable),
      },
      {
        path: 'fees',
        loadComponent: () => import('./Admin/fees/fees').then((x) => x.Fees),
      },
    ],
  },

  {
    path: 'teachers',
    loadComponent: () => import('./Teachers/techers-nav/techers-nav').then((x) => x.TechersNav),
    canActivate: [teacherGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./Teachers/quiz/quiz').then((x) => x.Quiz),
      },
      {
        path: 'attendence',
        loadComponent: () =>
          import('./Teachers/mark-attendence/mark-attendence').then((x) => x.MarkAttendence),
      },
      {
        path: 'application',
        loadComponent: () =>
          import('./Teachers/application/application').then((x) => x.Application),
      },
    ],
  },

  {
    path: '**',
    loadComponent: () => import('./notfound/notfound').then((x) => x.Notfound),
  },
];
