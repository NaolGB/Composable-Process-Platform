import { TestBed } from '@angular/core/testing';

import { ProcessPreviewService } from './process-preview.service';

describe('ProcessPreviewService', () => {
  let service: ProcessPreviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProcessPreviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
