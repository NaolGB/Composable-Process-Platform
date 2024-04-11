import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverlaySidebarCheckboxComponent } from './overlay-sidebar-checkbox.component';

describe('OverlaySidebarCheckboxComponent', () => {
  let component: OverlaySidebarCheckboxComponent;
  let fixture: ComponentFixture<OverlaySidebarCheckboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverlaySidebarCheckboxComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OverlaySidebarCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
