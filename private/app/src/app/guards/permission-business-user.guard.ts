import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const permissionBusinessUserGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const authService = inject(AuthService)

  const currentUserProfileSignal = authService.currentUserProfileSignal();
  if(currentUserProfileSignal){
    if(['admin', 'analyst', 'business-user'].includes(currentUserProfileSignal.role)) {
      return true;
    }
  }
  
  return router.navigateByUrl('/not-allowed')
};
