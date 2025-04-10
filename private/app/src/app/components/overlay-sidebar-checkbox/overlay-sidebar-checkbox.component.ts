import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CheckboxDataInterface } from '../../interfaces/design-interfaces';

@Component({
  selector: 'app-overlay-sidebar-checkbox',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './overlay-sidebar-checkbox.component.html',
  styleUrl: './overlay-sidebar-checkbox.component.scss'
})
export class OverlaySidebarCheckboxComponent {
  @Output() closeSidebar: EventEmitter<any> = new EventEmitter();
  @Output() emmiterOnSave: EventEmitter<string> = new EventEmitter();
  @Input() sidebarTitle: string | undefined;
  @Input() sidebarSubtitle: string | undefined;
  @Input() inputData: CheckboxDataInterface[] | undefined;
  
  isVisible: boolean = true;
  formGroup: FormGroup; 

  constructor(private formBuilder: FormBuilder) {
    this.formGroup = this.formBuilder.group({
      checkboxes: this.formBuilder.array([]) 
    });
  }

  get checkboxes(): FormArray {
    return this.formGroup.get('checkboxes') as FormArray;
  }

  ngOnInit(): void {
    if (this.inputData) {
      this.inputData.forEach((checkbox: CheckboxDataInterface) => {
        const control = this.formBuilder.group({
          id: [checkbox.id],
          display_name: [checkbox.display_name],
          is_checked: [checkbox.is_checked]
        });
        this.checkboxes.push(control); 
      })
    }
  }
  
  onToggleSidebar() {
    this.closeSidebar.emit();
  }

  onSave() {
    const checkedCheckboxes = this.checkboxes.value.filter((checkbox: CheckboxDataInterface) => checkbox.is_checked);
    const checkedCheckboxesIds = checkedCheckboxes.map((checkbox: CheckboxDataInterface) => checkbox.id).join(',');
    this.emmiterOnSave.emit(checkedCheckboxesIds);
    this.formGroup.reset();
    this.isVisible = false;
  }
}
