import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authAnalystGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  if(false){
    return false;
  }
  return router.navigateByUrl('/not-allowed')
};
