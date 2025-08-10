import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Auth } from '../services/auth';
import { map } from 'rxjs/operators';

export const roleGuard = (expectedRole: string): CanActivateFn => {
  return (route, state) => {
    const auth = inject(Auth);
    const router = inject(Router);
    return auth.roleObservable().pipe(map(role => {
      if (role !== expectedRole) { router.navigate(['/login']); return false; }
      return true;
    }));
  };
};
