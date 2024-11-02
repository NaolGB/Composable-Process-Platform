import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignMasterUpdateComponent } from './design-master-update.component';

describe('DesignMasterUpdateComponent', () => {
  let component: DesignMasterUpdateComponent;
  let fixture: ComponentFixture<DesignMasterUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesignMasterUpdateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DesignMasterUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
