import { TestBed } from '@angular/core/testing';

import { FunctionApiService } from './function-api.service';

describe('FunctionApiService', () => {
  let service: FunctionApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FunctionApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
