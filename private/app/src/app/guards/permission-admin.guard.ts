import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const permissionAdminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const authService = inject(AuthService)

  const currentUserProfileSignal = authService.currentUserProfileSignal();
  if(currentUserProfileSignal){
    if(currentUserProfileSignal.role === 'admin') {
      return true;
    }
  }
  
  return router.navigateByUrl('/not-allowed')
};
