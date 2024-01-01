import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMasterDtypeComponent } from './create-master-dtype.component';

describe('CreateMasterDtypeComponent', () => {
  let component: CreateMasterDtypeComponent;
  let fixture: ComponentFixture<CreateMasterDtypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateMasterDtypeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateMasterDtypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
