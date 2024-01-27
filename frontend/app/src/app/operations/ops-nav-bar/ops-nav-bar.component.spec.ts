import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpsNavBarComponent } from './ops-nav-bar.component';

describe('OpsNavBarComponent', () => {
  let component: OpsNavBarComponent;
  let fixture: ComponentFixture<OpsNavBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OpsNavBarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OpsNavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
