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

  // keep track of all stepIds separately from the form to ensure change detection traks the correct step
  // this is necessary because the form is a nested object and change detection does not work as expected
  stepsTracker: {[key:string]: string[]} = {};

  constructor(private formBuilder: FormBuilder, private dataService: DataService, private designApiService: DesignApiService) { 
    // create start step
    const startStepUid = dataService.generateUUID();
    this.stepsTracker[startStepUid] = [startStepUid];

    // initialize form with start step
    this.processTypeForm = this.formBuilder.group({ // initialize form with start step
      display_name: [''],
      documents: [''],
      steps: this.formBuilder.group({
        [startStepUid]: this.generateStepForm('start', startStepUid, 'Start') // all process types will have a start step
      })
    });
  }

  handleProcessFlowSelectorEvent(event: string) {
    this.selectedStepId = event;
    
    if (this.selectedStepId !== '__select_process_type') {
      this.selectedStepType = this.processTypeFormStepsForm.get(this.selectedStepId)!.get('type')!.value;
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
    return this.processTypeForm.getRawValue() as ProcessTypeInterface;
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

        // next_step
        const nextStep = step['next_step'];
        if (nextStep) {
          tempStep.next_step = {
            has_multiple_next_steps: true, // TODO: remove deprecated field
            next_step: nextStep,
            conditional_value: nextStep.conditional_value,
            conditions: {}
          };
        }

        // conditions
        // const conditions = nextStep.conditions;
        // if (conditions) {
        //   Object.keys(conditions).forEach((conditionKey: string) => {
        //     const condition = conditions[conditionKey];
        //     const tempCondition = {};
        //     tempCondition.comparison = condition.comparison;
        //     tempCondition.next_step = condition.next_step;
        //     tempStep.next_step.conditions[conditionKey] = tempCondition;
        //   });
        // }

        // add step to process type
        tempProcessType.steps[stepUid] = tempStep;
      }
      
    });
    
    return tempProcessType;
  }

  get processTypeFormStepsForm() {
    return this.processTypeForm.get('steps') as FormGroup;
  }

  getProcessStepFormById(stepId: string): FormGroup {
    return this.processTypeFormStepsForm.get(stepId) as FormGroup;
  }

  onOpentSidebar() {
    this.showSidebar = true;
  }

  handleCloseSidebar() {
    this.showSidebar = false;
  }

  handleSidebarData(checkedBoxIds: string) {
    this.processTypeForm.get('documents')!.setValue(checkedBoxIds);
    this.showSidebar = false;
  }

  getDocumentDisplayNameById(documentId: string): string {
    return this.documnetTypeList.find((documentType: any) => documentType._id === documentId).display_name || documentId;
  }

  generateStepForm(stepType: string = 'automated', stepId: string, displayName: string = '') {
    return this.formBuilder.group({
      step_uid: [stepId],
      display_name: new FormControl({value: displayName, disabled: ((stepType === 'start') || (stepType === 'end'))}),
      type: new FormControl({value: stepType, disabled: ((stepType === 'start') || (stepType === 'end'))}),
      manual_options: this.formBuilder.group({}),
      next_step: this.formBuilder.group({
        conditional_value: [''],
        conditions: this.formBuilder.group({})
      })
    });
  }

  addCondition(stepId: string, nextStepId: string) {
    const conditionsFormGroup = this.processTypeFormStepsForm.get(stepId)!.get('next_step')!.get('conditions') as FormGroup;
    
    conditionsFormGroup.addControl(
      nextStepId, 
      this.formBuilder.group({
        comparison: this.formBuilder.array([
          this.formBuilder.group({operator: [''], value: [''], logic: [''], next_comparison: ['']}),
        ]),
        next_step: new FormControl({value: nextStepId, disabled: true})
      })
    );
  }

  onGenerateNewNextStep(currentStepId: string) {
    const newStepUid: string = this.dataService.generateUUID();
    this.stepsTracker[currentStepId].push(newStepUid);

    // add new step to form
    const newStepForm = this.generateStepForm('automated', newStepUid);
    this.processTypeFormStepsForm.addControl(newStepUid, newStepForm);

    // connect new step to selected step
    this.addCondition(currentStepId, newStepUid);
    console.log(this.processTypeForm.getRawValue());
    console.log(this.processType)
  }

  generateArrayFromNumber(num: number): number[] {
    return Array(num).fill(0).map((x, i) => i);
  }

  onSubmit() {
    console.log(this.processTypeForm.getRawValue());
  }

  trackByStepId(index: number, stepId: string): string {
    return stepId;
  }
  
}
