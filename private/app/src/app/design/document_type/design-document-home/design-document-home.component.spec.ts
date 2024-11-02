import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignDocumentHomeComponent } from './design-document-home.component';

describe('DesignDocumentHomeComponent', () => {
  let component: DesignDocumentHomeComponent;
  let fixture: ComponentFixture<DesignDocumentHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesignDocumentHomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DesignDocumentHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
