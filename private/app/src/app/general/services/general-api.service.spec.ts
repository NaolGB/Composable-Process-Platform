import { TestBed } from '@angular/core/testing';

import { GeneralApiService } from './general-api.service';

describe('GeneralApiService', () => {
  let service: GeneralApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeneralApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
