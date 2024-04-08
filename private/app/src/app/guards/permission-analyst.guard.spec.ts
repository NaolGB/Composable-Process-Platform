import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { permissionAnalystGuard } from './permission-analyst.guard';

describe('permissionAnalystGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => permissionAnalystGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
