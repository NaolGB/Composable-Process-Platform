import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { GraphsProcessFlowComponent } from '../../../components/graphs-process-flow/graphs-process-flow.component';
import { CheckboxDataInterface, DocumentTypeInterface, ProcessStep, ProcessTypeInterface } from '../../../interfaces/design-interfaces';
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
  processFlowGraphComponentKey: number = 0;
  showProcessGraph: boolean = true;

  showSidebar: boolean = false;
  documnetTypeList: any[] = [];
  documentTypesAsCheckboxData: CheckboxDataInterface[] = [];
  selectedDocumentTypeObject: DocumentTypeInterface | undefined;

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
  }

  reloadProcessFlowGraph() {
    // Toggle Visibility: Temporarily setting showProcessGraph to false removes the component from the view.
    // This is combined with setTimeout to allow the JavaScript event loop to process the removal of the component from the DOM.
    // Change Key: Incrementing processFlowGraphComponentKey provides a new key each time, causing Angular to treat it as a completely new component when showProcessGraph is set to true again.
    // Reinsert Component: After incrementing the key, the component is added back to the DOM, forcing it to reinitialize.
    this.showProcessGraph = false;
    setTimeout(() => {
      this.processFlowGraphComponentKey++;
      this.showProcessGraph = true;
    }, 0);
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
  }

  get processTypeFormStepsForm() {
    return this.processTypeForm.get('steps') as FormGroup;
  }

  get selectedDocumentTypes(): {id: string, display_name: string}[] {
    const tempDocumentTypes: {id: string, display_name: string}[] = [];

    const processDocuments = this.processTypeForm.get('documents')!.value.split(',');
    if (!processDocuments[0]) return [];

    processDocuments.forEach((documentId: string) => {
      tempDocumentTypes.push({
        id: documentId,
        display_name: this.documnetTypeList.find((documentType: any) => documentType._id === documentId)!.display_name || ''
      });
    });

    return tempDocumentTypes;
  }

  getProcessStepFormById(stepId: string): FormGroup {
    return this.processTypeFormStepsForm.get(stepId) as FormGroup;
  }

  onOpentSidebar() {
    this.showSidebar = true;
  }

  onSelectDocumentType(documentTypeId: string) {
    this.designApiService.getDocumentType(documentTypeId).subscribe(
      (response: any) => {
      this.selectedDocumentTypeObject = response;
    });
  }


  handleCloseSidebar() {
    this.showSidebar = false;
  }

  handleSidebarData(checkedBoxIds: string) {
    this.processTypeForm.get('documents')!.setValue(checkedBoxIds);
    this.showSidebar = false;
  }

  generateStepForm(stepType: string = 'automated', stepId: string, displayName: string = '') {
    return this.formBuilder.group({
      step_uid: [stepId],
      display_name: new FormControl({value: displayName, disabled: ((stepType === 'start') || (stepType === 'end'))}),
      type: new FormControl({value: stepType, disabled: ((stepType === 'start') || (stepType === 'end'))}),
      document_type: [''],
      __function: [''],
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
    this.stepsTracker[newStepUid] = [];
    this.stepsTracker[currentStepId].push(newStepUid);

    // add new step to form
    const newStepForm = this.generateStepForm('automated', newStepUid);
    this.processTypeFormStepsForm.addControl(newStepUid, newStepForm);

    // connect new step to selected step
    this.addCondition(currentStepId, newStepUid);
    this.reloadProcessFlowGraph();
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
