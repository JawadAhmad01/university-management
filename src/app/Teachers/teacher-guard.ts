import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Signin } from '../interfaces/signin';
import { map } from 'rxjs';

export const teacherGuard: CanActivateFn = (route, state) => {
  const http = inject(HttpClient);
  const router = inject(Router);
  return http.get<Signin>('http://localhost:3000/auth').pipe(
    map((stud) => {
      if (stud.role === 'teacher' && stud.loggedIn === true) {
        return true;
      } else {
        router.navigateByUrl('/signin');
        return false;
      }
    })
  );
};
