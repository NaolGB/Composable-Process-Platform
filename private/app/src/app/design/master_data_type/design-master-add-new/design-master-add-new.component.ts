import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-design-master-add-new',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './design-master-add-new.component.html',
  styleUrl: './design-master-add-new.component.scss'
})
export class DesignMasterAddNewComponent {
  masterDataTypeForm: FormGroup;
  masterDataAttributeTypeOptions: string[] = ['Text', 'Number', 'Boolean', 'Date', 'Master Data Type'];
  
  constructor(private formBuilder: FormBuilder) {
    this.masterDataTypeForm = this.formBuilder.group({
      display_name: ['', Validators.required],
      attributes: this.formBuilder.array([
        this.formBuilder.group({
          display_name: ['', Validators.required],
          type: [this.masterDataAttributeTypeOptions[0], Validators.required],
          is_required: [false, Validators.required],
          default_value: ['', Validators.required]
        })
      ])
    });
  }

  get attributes() {
    return this.masterDataTypeForm.get('attributes') as FormArray;
  }

  get displayName()  {
    return this.masterDataTypeForm.get('display_name')?.value;
  }

  addAttribute() {
    const attribute = this.formBuilder.group({
      display_name: ['', Validators.required],
      type: [this.masterDataAttributeTypeOptions[0], Validators.required],
      is_required: [false, Validators.required],
      default_value: ['', Validators.required]
    });

    this.attributes.push(attribute);
  }
}
