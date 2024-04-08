import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { permissionAdminGuard } from './permission-admin.guard';

describe('permissionAdminGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => permissionAdminGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
