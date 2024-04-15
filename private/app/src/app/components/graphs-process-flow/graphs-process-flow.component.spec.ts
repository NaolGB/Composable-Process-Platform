import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphsProcessFlowComponent } from './graphs-process-flow.component';

describe('GraphsProcessFlowComponent', () => {
  let component: GraphsProcessFlowComponent;
  let fixture: ComponentFixture<GraphsProcessFlowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraphsProcessFlowComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GraphsProcessFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
