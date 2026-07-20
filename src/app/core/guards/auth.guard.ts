
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Logged in → allow the route to activate.
  if (authService.isLoggedIn()) {
    return true;
  }

  // Not logged in → bounce to /login and remember where they were headed,
  // so you can send them back after a successful login (see login.component.ts note).
  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url }
  });
};