import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { authAnalystGuard } from './auth-analyst.guard';

describe('authAnalystGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authAnalystGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
