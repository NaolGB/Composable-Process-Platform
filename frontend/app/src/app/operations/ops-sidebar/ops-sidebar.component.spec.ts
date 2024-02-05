import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpsSidebarComponent } from './ops-sidebar.component';

describe('OpsSidebarComponent', () => {
  let component: OpsSidebarComponent;
  let fixture: ComponentFixture<OpsSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OpsSidebarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OpsSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
