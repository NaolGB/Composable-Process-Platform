import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { permissionBusinessUserGuard } from './permission-business-user.guard';

describe('permissionBusinessUserGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => permissionBusinessUserGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
