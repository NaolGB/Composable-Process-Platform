import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignMasterEditComponent } from './design-master-edit.component';

describe('DesignMasterEditComponent', () => {
  let component: DesignMasterEditComponent;
  let fixture: ComponentFixture<DesignMasterEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesignMasterEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DesignMasterEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
