import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignProcessAddNewComponent } from './design-process-add-new.component';

describe('DesignProcessAddNewComponent', () => {
  let component: DesignProcessAddNewComponent;
  let fixture: ComponentFixture<DesignProcessAddNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesignProcessAddNewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DesignProcessAddNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
