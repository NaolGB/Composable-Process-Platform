import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsHomeComponent } from './analytics-home.component';

describe('AnalyticsHomeComponent', () => {
  let component: AnalyticsHomeComponent;
  let fixture: ComponentFixture<AnalyticsHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalyticsHomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnalyticsHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
