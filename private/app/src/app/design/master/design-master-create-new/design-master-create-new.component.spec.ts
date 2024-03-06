import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignMasterCreateNewComponent } from './design-master-create-new.component';

describe('DesignMasterCreateNewComponent', () => {
  let component: DesignMasterCreateNewComponent;
  let fixture: ComponentFixture<DesignMasterCreateNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesignMasterCreateNewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DesignMasterCreateNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
