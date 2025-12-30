import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { Signin } from '../interfaces/signin';

export const adminGuard: CanActivateFn = (route, state) => {
  const http = inject(HttpClient);
  const router = inject(Router);
  return http.get<Signin>('http://localhost:3000/auth').pipe(
    map((admin) => {
      if (admin.role === 'admin' && admin.loggedIn === true) {
        return true;
      } else {
        router.navigateByUrl('/signin');
        return false;
      }
    })
  );
};
