import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Auth } from '../services/auth';
import { map } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);
  return auth.isLoggedIn().pipe(map(logged => {
    if (!logged) { router.navigate(['/login']); return false; }
    return true;
  }));
};
