import { TestBed } from '@angular/core/testing';

import { DesignDataService } from './design-data.service';

describe('DesignDataService', () => {
  let service: DesignDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DesignDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
