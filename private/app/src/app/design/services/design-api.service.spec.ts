import { TestBed } from '@angular/core/testing';

import { DesignApiService } from './design-api.service';

describe('DesignApiService', () => {
  let service: DesignApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DesignApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
