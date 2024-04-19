import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationRequestHomeComponent } from './operation-request-home.component';

describe('OperationRequestHomeComponent', () => {
  let component: OperationRequestHomeComponent;
  let fixture: ComponentFixture<OperationRequestHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperationRequestHomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OperationRequestHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
