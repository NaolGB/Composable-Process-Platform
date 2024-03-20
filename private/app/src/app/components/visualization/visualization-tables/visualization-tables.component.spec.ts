import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizationTablesComponent } from './visualization-tables.component';

describe('VisualizationTablesComponent', () => {
  let component: VisualizationTablesComponent;
  let fixture: ComponentFixture<VisualizationTablesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisualizationTablesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VisualizationTablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
