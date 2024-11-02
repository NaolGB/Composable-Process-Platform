import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authLoginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const authService = inject(AuthService)

  const currentUserSignal = authService.currentUserSignal();
  if(currentUserSignal){
    return true;
  }
  return router.navigateByUrl('/login')
};
