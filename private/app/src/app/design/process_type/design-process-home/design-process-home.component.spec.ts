import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignProcessHomeComponent } from './design-process-home.component';

describe('DesignProcessHomeComponent', () => {
  let component: DesignProcessHomeComponent;
  let fixture: ComponentFixture<DesignProcessHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesignProcessHomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DesignProcessHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
