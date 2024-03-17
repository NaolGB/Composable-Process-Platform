import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignMasterHomeComponent } from './design-master-home.component';

describe('DesignMasterHomeComponent', () => {
  let component: DesignMasterHomeComponent;
  let fixture: ComponentFixture<DesignMasterHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesignMasterHomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DesignMasterHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
