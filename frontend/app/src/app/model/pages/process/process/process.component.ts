import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { DataService } from '../../../../services/data.service';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { ProcessTypeParsedData } from '../../../../interfaces';

@Component({
  selector: 'app-process',
  templateUrl: './process.component.html',
  styleUrl: './process.component.css',
})
export class ProcessComponent {
  selectedTab: number = 1

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

  constructor(private apiServices: DataService, private formBuilder: FormBuilder, private cd: ChangeDetectorRef) {}

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
    this.getSelectedProcessById()
  }

  selectTab(tabNumber: number) {
    this.selectedTab = tabNumber
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
    this.selectedTab = 2
  }

  getSelectedProcessById() {
    if (this.selectedProcessId !== '') {
      this.apiServices.getProcessById(this.selectedProcessId).subscribe(
        (response) => {
            this.selectedProcessObject = response
            // this.processDesignStatus = this.processData["design_status"]
            // this.allStepsObject = this.processData['attributes']['steps']
            // this.allStepsArray = this.processPreviewServices.getAllStepsArray(this.allStepsObject)
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

}
