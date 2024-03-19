import { TestBed } from '@angular/core/testing';

import { DesignMasterGeneralService } from './design-master-general.service';

describe('DesignMasterGeneralService', () => {
  let service: DesignMasterGeneralService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DesignMasterGeneralService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
