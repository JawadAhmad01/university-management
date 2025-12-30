import { CanActivateFn } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { Signin } from '../interfaces/signin';

export const studGardGuard: CanActivateFn = (route, state) => {
  const http = inject(HttpClient);
  const router = inject(Router);
  return http.get<Signin>('http://localhost:3000/auth').pipe(
    map((stud) => {
      if (stud.status === 'approved' && stud.role === 'student' && stud.loggedIn === true) {
        return true;
      } else {
        router.navigateByUrl('/signin');
        return false;
      }
    })
  );
};
