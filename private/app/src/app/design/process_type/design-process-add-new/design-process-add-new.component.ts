import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { GraphsProcessFlowComponent } from '../../../components/graphs-process-flow/graphs-process-flow.component';
import { ProcessTypeInterface } from '../../../interfaces/design-interfaces';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { OverlaySidebarCheckboxComponent } from '../../../components/overlay-sidebar-checkbox/overlay-sidebar-checkbox.component';

@Component({
  selector: 'app-design-process-add-new',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    GraphsProcessFlowComponent,
    OverlaySidebarCheckboxComponent
  ],
  templateUrl: './design-process-add-new.component.html',
  styleUrls: ['./design-process-add-new.component.scss']
})
export class DesignProcessAddNewComponent {
  selectedStepId: string = '__select_process_type';
  processType: ProcessTypeInterface;
  processTypeForm: FormGroup;

  showSidebar: boolean = false;

  constructor(private formBuilder: FormBuilder) { 
    this.processType = {
      display_name: '',
      documents: [],
      steps: {
      }
    };
    this.processTypeForm = this.formBuilder.group({
      display_name: [''],
      documents: this.formBuilder.array([]),
      steps: this.formBuilder.array([])
    });
  }

  handleProcessFlowSelectorEvent(event: string) {
    this.selectedStepId = event;
  }

  handleCloseSidebar() {
    this.showSidebar = false;
  }

}
