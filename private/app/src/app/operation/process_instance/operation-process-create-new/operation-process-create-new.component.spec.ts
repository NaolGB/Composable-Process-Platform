import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationProcessCreateNewComponent } from './operation-process-create-new.component';

describe('OperationProcessCreateNewComponent', () => {
  let component: OperationProcessCreateNewComponent;
  let fixture: ComponentFixture<OperationProcessCreateNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperationProcessCreateNewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OperationProcessCreateNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
