import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTransactionTypeComponent } from './create-transaction-type.component';

describe('CreateTransactionTypeComponent', () => {
  let component: CreateTransactionTypeComponent;
  let fixture: ComponentFixture<CreateTransactionTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateTransactionTypeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateTransactionTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
