import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationProcessHomeComponent } from './operation-process-home.component';

describe('OperationProcessHomeComponent', () => {
  let component: OperationProcessHomeComponent;
  let fixture: ComponentFixture<OperationProcessHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperationProcessHomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OperationProcessHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
