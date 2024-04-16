import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { GraphsProcessFlowComponent } from '../../../components/graphs-process-flow/graphs-process-flow.component';
import { CheckboxDataInterface, ProcessStep, ProcessTypeInterface } from '../../../interfaces/design-interfaces';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { OverlaySidebarCheckboxComponent } from '../../../components/overlay-sidebar-checkbox/overlay-sidebar-checkbox.component';
import { DataService } from '../../../services/data.service';
import { DesignApiService } from '../../services/design-api.service';

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
  selectedStepType: string = 'start';
  processTypeForm: FormGroup;

  temp: string = 'start';

  showSidebar: boolean = false;
  documnetTypeList: any[] = [];
  documentTypesAsCheckboxData: CheckboxDataInterface[] = [];

  // keep track of all steps and their forms to facilitate next_step connection and form data
  stepsTracker: {[key: string]: {type: string, form: FormGroup}} = {}; 

  constructor(private formBuilder: FormBuilder, private dataService: DataService, private designApiService: DesignApiService) { 
    // create start step
    const startStepUid = dataService.generateUUID();
    this.stepsTracker[startStepUid] = { // start step
      type: 'start', 
      form: this.generateStepForm('start', startStepUid)
    };

    // initialize form with start step
    this.processTypeForm = this.formBuilder.group({ // initialize form with start step
      display_name: [''],
      documents: [''],
      steps: this.formBuilder.group({
        [startStepUid]: this.generateStepForm('start', startStepUid) // all process types will have a start step
      })
    });
  }

  handleProcessFlowSelectorEvent(event: string) {
    this.selectedStepId = event;
    
    if (this.selectedStepId !== '__select_process_type') {
      this.selectedStepType = this.stepsTracker[this.selectedStepId].type;
    }
  }

  ngOnInit(): void {
    this.designApiService.getDocumentTypeList().subscribe(
      (response: any) => {
      this.documnetTypeList = response;
      this.documnetTypeList.forEach((documentTypeListData: any) => {
        this.documentTypesAsCheckboxData.push({
          id: documentTypeListData._id,
          display_name: documentTypeListData.display_name,
          is_checked: false
        });
      })
    });
  }

  get processType(): ProcessTypeInterface {
    const tempProcessType: ProcessTypeInterface = {
      display_name: '',
      documents: [],
      steps: {}
    };
    tempProcessType.display_name = this.processTypeForm.value.display_name;

    // documents
    const processTypeFormDocuments = this.processTypeForm.get('documents')!.value;
    if (processTypeFormDocuments) {
      tempProcessType.documents = processTypeFormDocuments.split(',');
    }

    // steps
    const processTypeFormSteps = this.processTypeForm.getRawValue().steps;
    Object.keys(processTypeFormSteps).forEach((stepUid: string) => {
      const step = processTypeFormSteps[stepUid];

      if (step) {
        const tempStep = {} as ProcessStep;
        tempStep.display_name = step['display_name'];
        tempStep.type = step['type'];

        // TODO: next_step
        const nextStep = step['next_step'];
        if (nextStep) {
          tempStep.next_step = {
            has_multiple_next_steps: false,
            next_step: nextStep,
            conditional_value: '',
            conditions: {}
          };
        }

        // add step to process type
        tempProcessType.steps[stepUid] = tempStep;
      }
      
    });
    
    return tempProcessType;
  }

  get processTypeFormStepsForm() {
    return this.processTypeForm.get('steps') as FormGroup;
  }

  onOpentSidebar() {
    this.showSidebar = true;
  }

  handleCloseSidebar() {
    this.showSidebar = false;
  }

  handleSidebarData(checkedBoxIds: string) {
    this.processTypeForm.get('documents')!.setValue(checkedBoxIds);
    console.log(this.processTypeForm.getRawValue());
    this.showSidebar = false;
  }

  getDocumentDisplayNameById(documentId: string): string {
    return this.documnetTypeList.find((documentType: any) => documentType._id === documentId).display_name || documentId;
  }

  generateStepForm(stepType: string, stepId: string) {
    if (stepType === 'start') {
      return this.formBuilder.group({
        step_uid: [stepId],
        display_name: new FormControl({value: 'Start', disabled: true}),
        type: new FormControl({value: 'start', disabled: true}),
        next_step: this.formBuilder.group({
          has_multiple_next_steps: [false],
          next_step: [''],
          conditional_value: [''],
          conditions: this.formBuilder.array([])
        })
      });
    }
    else if (stepType === 'end') {
      return this.formBuilder.group({});
    }
    else if (stepType === 'manual') {
      return this.formBuilder.group({});
    }
    else { // automated
      return this.formBuilder.group({});
    }
  }

  onSubmit() {
    console.log(this.processTypeForm.getRawValue());
  }

}
