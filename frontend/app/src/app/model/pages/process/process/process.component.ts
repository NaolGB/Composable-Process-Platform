import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { DataService } from '../../../../services/data.service';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { ProcessPreviewService } from '../../../../services/process-preview.service';
import { NewProcessProcessTypeInterface, ProcessStepInterface, ProcessTypeInterface } from '../../../../interfaces';

@Component({
  selector: 'app-process',
  templateUrl: './process.component.html',
  styleUrl: './process.component.css',
})
export class ProcessComponent {
  selectedTab: string = 'generate';
  selectedProcessDocuments: { [key: string]: any } = {};

  // Generate Process tab variables
  documentTypeIds: string[] = [];
  processTypeIds: string[] = [];
  generateProcessForm = this.formBuilder.group({
    nameAndSteps: this.formBuilder.group({
      name: ['', Validators.required],
      steps: ['', Validators.required],
    }),
    documents: this.formBuilder.array([
      this.formBuilder.group({
        documentId: ['', Validators.required],
      }),
    ]),
  });

  // Connect Process tab variables
  selectedProcessId: string = '';
  selectedProcessObject!: ProcessTypeInterface;
  allStepsObject!: { [key: string]: ProcessStepInterface; };
  selectedStepKey: string = '';
  allStepsList: string[] = [];

  // Add Step Type and Fields tab variables
  selectedEventType: string = 'read';

  // Transition Requirements tab variables
  requirementsContentType: string = 'requirements';

  // Action tab variables
  actionsContentType: string = 'actions';

  constructor(
    private apiServices: DataService,
    private formBuilder: FormBuilder,
    private previewServices: ProcessPreviewService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Generate Process tab inits
    this.apiServices.getDocumentTypeIds().subscribe((resposne) => {
      this.documentTypeIds = resposne['ids'];
    });
    this.apiServices.getProcessTypeIds().subscribe((response) => {
      this.processTypeIds = response['ids'];
    });
  }

  selectTab(tabName: string) {
    this.selectedTab = tabName;
  }

  putProcess() {
    this.apiServices
      .putProcessById(this.selectedProcessId, this.selectedProcessObject)
      .subscribe
      // TODO refresh process type to get new design_status
      ();
  }

  publishProcess() {
    this.apiServices
      .putProcessByIdForPublishing(
        this.selectedProcessId,
        this.selectedProcessObject
      )
      .subscribe
      // TODO check if response is OK
      ();
  }

  get processDesignStatus() {
    if (this.selectedProcessObject['design_status']) {
      return this.selectedProcessObject['design_status'];
    } else {
      return '';
    }
  }

  // Generate Process tab functions
  get documents() {
    return this.generateProcessForm.get('documents') as FormArray;
  }

  refreshProcessTypeIds() {
    this.apiServices.getProcessTypeIds().subscribe((response) => {
      this.processTypeIds = response['ids'];
    });
  }

  addDocumentType() {
    this.documents.push(
      this.formBuilder.group({
        documentId: ['', Validators.required],
      })
    );
  }

  selectProcess(id: string) {
    this.selectedProcessId = id;
    this.getSelectedProcessById();
    this.selectTab('connect');
  }

  getSelectedProcessById() {
    if (this.selectedProcessId !== '') {
      this.apiServices
        .getProcessById(this.selectedProcessId)
        .subscribe((response) => {
          this.selectedProcessObject = response;
          this.allStepsObject = this.selectedProcessObject['steps'];
          this.allStepsList = this.previewServices.getAllStepsArray(
            this.allStepsObject
          );

          this.selectedProcessObject['documents'].forEach((element: string) => {
            this.apiServices
              .getDocumentTypeById(element)
              .subscribe((response) => {
                this.selectedProcessDocuments[element] = response;
                console.log(this.selectedProcessDocuments);
              });
          });
        });
    }
  }

  onGenerateProcessSubmit() {
    const parsedPostData: NewProcessProcessTypeInterface = {
      name: this.generateProcessForm.get('nameAndSteps')?.get('name')?.value || '',
      steps: this.generateProcessForm.get('nameAndSteps')?.get('steps')?.value || '',
      documents: [],
    };

    for (let i = 0; i < this.documents.length; i++) {
      parsedPostData['documents'].push(
        this.documents.controls[i].value['documentId']
      );
    }

    this.apiServices.postNewProcessType(parsedPostData).subscribe(
      (response) => {
        this.refreshProcessTypeIds();
      },
      (error) => {
        alert(error);
      }
    );
  }

  // Connect Process tab functions
  selectStep(stepKey: string) {
    // only available after process is selected (selectedProcessId !== '')
    this.selectedStepKey = stepKey;
  }

  get connectedSteps() {
    return this.previewServices.getConnectedStepsArray(
      this.allStepsObject,
      this.allStepsList
    );
  }

  get unconnectedSteps() {
    return this.allStepsList.filter(
      (step) => !this.connectedSteps.includes(step)
    );
  }

  get ValidNextSteps() {
    // use step order's column function to disable loops in processes
    this.allStepsObject = this.previewServices.getStepsOrder(
      this.allStepsObject
    );
    let validNextSteps = this.allStepsList;

    // exculde next steps already included
    let currenNextSteps: (string)[] =
      this.allStepsObject[this.selectedStepKey]['next_steps']['steps'];
    // NOTE the filter statement is not inline function, do not add filter statemetn in {}
    validNextSteps = validNextSteps.filter(
      (item) => !currenNextSteps.includes(item)
    );

    // exculde current step
    validNextSteps = validNextSteps.filter(
      (item) => item != this.selectedStepKey
    );

    // excliude next steps alread before this step
    let parentSteps: (string)[] = [];
    Object.keys(this.allStepsObject).forEach((step) => {
      // unconnected steps will have larger column value so they need to be nopt excluded
      if (validNextSteps.includes(step) && this.connectedSteps.includes(step)) {
        if (
          this.allStepsObject[step]['column'] <
          this.allStepsObject[this.selectedStepKey]['column']
        ) {
          parentSteps.push(step);
        }
      }
    });

    validNextSteps = validNextSteps.filter(
      (item) => !parentSteps.includes(item)
    );

    return validNextSteps;
  }

  addNextStep(nextStepKey: string) {
    this.allStepsObject[this.selectedStepKey]['next_steps']['steps'].push(
      nextStepKey
    );
    this.allStepsObject = { ...this.selectedProcessObject['steps'] };
    this.allStepsObject = this.previewServices.getStepsOrder(
      this.allStepsObject
    );
  }

  // Add Step Type and Fields tab functions
  selectEventType(eventTypeName: string) {
    this.selectedEventType = eventTypeName;
  }

  addUpdateDocumentField(documentId: string, fieldId: any) {
    const fullFieldId = `${documentId}.${fieldId}`;
    this.selectedProcessObject['steps'][this.selectedStepKey]['event_type'] =
      'update';

    // add to document_fields
    if (
      Object.keys(
        this.selectedProcessObject['steps'][this.selectedStepKey]['fields']
      ).includes(documentId)
    ) {
      if (
        !this.selectedProcessObject['steps'][this.selectedStepKey]['fields'][
          documentId
        ]['document_fields'].includes(fullFieldId)
      ) {
        this.selectedProcessObject['steps'][this.selectedStepKey]['fields'][
          documentId
        ]['document_fields'].push(fullFieldId);
      }
    } else {
      this.selectedProcessObject['steps'][this.selectedStepKey]['fields'][
        documentId
      ] = {
        document_fields: [fullFieldId],
        lead_object_fields: [],
      };
    }
  }

  addUpdateSourceField(documentId: string, fieldId: any) {
    const fullFieldId = `${documentId}.${this.selectedProcessDocuments[documentId]['lead_object']}.${fieldId}`;
    this.selectedProcessObject['steps'][this.selectedStepKey]['event_type'] =
      'update';

    // add to document_fields
    if (
      Object.keys(
        this.selectedProcessObject['steps'][this.selectedStepKey]['fields']
      ).includes(documentId)
    ) {
      if (
        !this.selectedProcessObject['steps'][this.selectedStepKey]['fields'][
          documentId
        ]['lead_object_fields'].includes(fullFieldId)
      ) {
        this.selectedProcessObject['steps'][this.selectedStepKey]['fields'][
          documentId
        ]['lead_object_fields'].push(fullFieldId);
      }
    } else {
      this.selectedProcessObject['steps'][this.selectedStepKey]['fields'][
        documentId
      ] = {
        document_fields: [],
        lead_object_fields: [fullFieldId],
      };
    }
  }

  addCreateDocumentField(documentId: string) {
    this.selectedProcessObject['steps'][this.selectedStepKey]['event_type'] = 'create';

    // add to document_fields, their corresponding extra attributes and source instances' editable fields
    if (!Object.keys(this.selectedProcessObject['steps'][this.selectedStepKey]['fields']).includes(documentId)) {

      this.selectedProcessObject['steps'][this.selectedStepKey]['fields'][documentId] = {
        document_fields: Object.keys(this.selectedProcessDocuments[documentId]['attributes']),
        lead_object_fields: this.selectedProcessDocuments[documentId]['editable_fields'],
      };

      console.log(this.selectedProcessObject)

    }
  }

  // Add Transition Requirements tab functions
  onMonacoRequirementContentChagne($newContent: string) {
    this.allStepsObject[this.selectedStepKey]['next_steps']['requirements'] =
      $newContent;
  }

  // Add Action tab functions
  onMonacoActionContentChagne($newContent: string) {
    this.allStepsObject[this.selectedStepKey]['options']['save']['actions'] =
      $newContent;
  }
}
