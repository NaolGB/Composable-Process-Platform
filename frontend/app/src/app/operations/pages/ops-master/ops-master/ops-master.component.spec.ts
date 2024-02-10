import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpsMasterComponent } from './ops-master.component';

describe('OpsMasterComponent', () => {
  let component: OpsMasterComponent;
  let fixture: ComponentFixture<OpsMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OpsMasterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OpsMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
