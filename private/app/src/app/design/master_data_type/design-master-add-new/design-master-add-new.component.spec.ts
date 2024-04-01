import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignMasterAddNewComponent } from './design-master-add-new.component';

describe('DesignMasterAddNewComponent', () => {
  let component: DesignMasterAddNewComponent;
  let fixture: ComponentFixture<DesignMasterAddNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesignMasterAddNewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DesignMasterAddNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
