import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignDocumentAddNewComponent } from './design-document-add-new.component';

describe('DesignDocumentAddNewComponent', () => {
  let component: DesignDocumentAddNewComponent;
  let fixture: ComponentFixture<DesignDocumentAddNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesignDocumentAddNewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DesignDocumentAddNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
