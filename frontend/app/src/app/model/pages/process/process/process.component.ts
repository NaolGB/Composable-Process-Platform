import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { DataService } from '../../../../services/data.service';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { ProcessTypeParsedData } from '../../../../interfaces';
import { ProcessPreviewService } from '../../../../services/process-preview.service';
import { concat } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-process',
  templateUrl: './process.component.html',
  styleUrl: './process.component.css',
})
export class ProcessComponent {
  selectedTab: string | number = 'generate'
  selectedProcessDocuments: {[key: string | number]: any} = {}

  // Generate Process tab variables  
  documentTypeIds: Array<String> = []
  processTypeIds: (string|number)[] = []
  generateProcessForm = this.formBuilder.group({
    nameAndSteps: this.formBuilder.group({
      name: ['', Validators.required],
      steps: ['', Validators.required],
    }),
    documents: this.formBuilder.array([
      this.formBuilder.group({
        documentId: ['', Validators.required]
      })
    ])
  })

  // Connect Process tab variables
  selectedProcessId: string | number = ''
  selectedProcessObject: ProcessTypeParsedData = {}
  allStepsObject: ProcessTypeParsedData = {}
  selectedStepKey: string | number = ''
  allStepsList: (string | number)[] = []

  // Add Step Type and Fields tab variables
  selectedEventType: string = 'read'

  // Transition Requirements tab variables
  requirementsContentType: string = 'requirements'

  // Action tab variables
  actionsContentType: string = 'actions'

  constructor(private apiServices: DataService, private formBuilder: FormBuilder, private previewServices: ProcessPreviewService, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    // Generate Process tab inits
    this.apiServices.getDocumentTypeIds().subscribe(
      (resposne) => {
        this.documentTypeIds = resposne['ids']
      }
    )
    this.apiServices.getProcessTypeIds().subscribe(
      (response) => {
        this.processTypeIds = response['ids']
      }
    )
  }

  selectTab(tabName: string | number) {
    this.selectedTab = tabName

    if((tabName === 'connect') && (this.selectedProcessId !== '') ) {
      this.apiServices.getProcessById(this.selectedProcessId).subscribe(
        (response) => {
          this.selectedProcessObject = response
        }
      )
    }

  }

  putProcess() {
    this.apiServices.putProcessById(this.selectedProcessId, this.selectedProcessObject).subscribe(
      // TODO refresh process type to get new design_status
    )
  }

  get processDesignStatus() {
    if (this.selectedProcessObject['design_status']) {
      return this.selectedProcessObject['design_status']
    }
    else{
      return ''
    }
  }

  // Generate Process tab functions
  get documents() {
    return this.generateProcessForm.get("documents") as FormArray
  }

  refreshProcessTypeIds() {
    this.apiServices.getProcessTypeIds().subscribe(
      (response) => {
        this.processTypeIds = response['ids']
      }
    )
  }

  addDocumentType() {
    this.documents.push(
      this.formBuilder.group({
        documentId: ['', Validators.required]
      })
    )
  }

  selectProcess(id: string | number) {
    this.selectedProcessId = id
    this.getSelectedProcessById()
    this.selectTab('connect')
  }

  getSelectedProcessById() {
    if (this.selectedProcessId !== '') {
      this.apiServices.getProcessById(this.selectedProcessId).subscribe(
        (response) => {
            this.selectedProcessObject = response
            this.allStepsObject = this.selectedProcessObject['steps']
            this.allStepsList = this.previewServices.getAllStepsArray(this.allStepsObject)
            
            this.selectedProcessObject['documents'].forEach((element: string) => {
              this.apiServices.getDocumentTypeById(element).subscribe(
                (response) => {
                  this.selectedProcessDocuments[element] = response
                  console.log(this.selectedProcessDocuments)
                }
              )
            });

        }
      )
    }
  }
  
  onGenerateProcessSubmit() {
    const parsedPostData: ProcessTypeParsedData = {
			name: this.generateProcessForm.get("nameAndSteps")?.get("name")?.value || "",
			steps: this.generateProcessForm.get("nameAndSteps")?.get("steps")?.value || "",
      documents: []
		}

    for (let i = 0; i < this.documents.length; i++) {
      parsedPostData['documents'].push(this.documents.controls[i].value["documentId"])
    }

    this.apiServices.postProcessType(parsedPostData).subscribe(
      (response) => {
        this.refreshProcessTypeIds()
      },
      (error) => {
        alert(error)
      }
    )
  }

  // Connect Process tab functions
  selectStep(stepKey: string | number) {
    // only available after process is selected (selectedProcessId !== '')
    this.selectedStepKey = stepKey
    console.log(this.selectedStepKey)
  }

  get connectedSteps() {
    return this.previewServices.getConnectedStepsArray(this.allStepsObject, this.allStepsList)
  }

  get unconnectedSteps() {
    return this.allStepsList.filter(step => !this.connectedSteps.includes(step))
  }

  get ValidNextSteps() {
    // use step order's column function to disable loops in processes
    this.allStepsObject = this.previewServices.getStepsOrder(this.allStepsObject)
    let validNextSteps = this.allStepsList

    // exculde next steps already included
    let currenNextSteps: (string | number)[] = this.allStepsObject[this.selectedStepKey]['next_steps']['steps']
    // NOTE the filter statement is not inline function, do not add filter statemetn in {}
    validNextSteps = validNextSteps.filter(item => !currenNextSteps.includes(item))

    // exculde current step
    validNextSteps = validNextSteps.filter(item => item != this.selectedStepKey)
    
    // excliude next steps alread before this step
    let parentSteps: (string | number)[] = []
    Object.keys(this.allStepsObject).forEach(step => {
      // unconnected steps will have larger column value so they need to be nopt excluded
      if (validNextSteps.includes(step) && (this.connectedSteps.includes(step))) { 
        if (this.allStepsObject[step]['column'] < this.allStepsObject[this.selectedStepKey]['column']) {
          parentSteps.push(step)
        }
      }
    })

    validNextSteps = validNextSteps.filter(item => !parentSteps.includes(item))

    return validNextSteps
  }

  addNextStep(nextStepKey: string | number) {
    this.allStepsObject[this.selectedStepKey]['next_steps']['steps'].push(nextStepKey)
    this.allStepsObject = {...this.selectedProcessObject['steps']}
    this.allStepsObject = this.previewServices.getStepsOrder(this.allStepsObject)
  }

  // Add Step Type and Fields tab functions
  selectEventType(eventTypeName: string) {
    this.selectedEventType = eventTypeName
  }

  // Add Transition Requirements tab functions
  onMonacoRequirementContentChagne($newContent: string) {
    this.allStepsObject[this.selectedStepKey]['next_steps']['requirements'] = $newContent
  }

  // Add Action tab functions
  onMonacoActionContentChagne($newContent: string) {
    this.allStepsObject[this.selectedStepKey]['options']['save']['actions'] = $newContent
  }

}
