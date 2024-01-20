import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../../../services/data.service';
import { ProcessTypeParsedData } from '../../../../interfaces';
import { ProcessPreviewService } from '../../../../services/process-preview.service';

@Component({
  selector: 'app-connect',
  templateUrl: './connect.component.html',
  styleUrl: './connect.component.css'
})
export class ConnectComponent {
  @ViewChild('canvas') canvas!: ElementRef;
  processId: string = ''
  processData: ProcessTypeParsedData = {}
  processDesignStatus: string = ""
  allStepsObject: ProcessTypeParsedData = {}
  allStepsArray: (string | number)[] = []
  selectedStep: ProcessTypeParsedData = {}
  selectedStepKey: (string | number) = ''
  stepSelected: boolean = false
  sidebarContent: string = 'stepsList'

  constructor(
    private route: ActivatedRoute, 
    private apiServices: DataService, 
    private cd: ChangeDetectorRef, 
    private processPreviewServices: ProcessPreviewService,
  ) {}

  ngOnInit() {
    this.processId = this.route.snapshot.paramMap.get('id') || ""
    this.apiServices.getProcessById(this.processId).subscribe(
      (response) => {
          this.processData = response
          this.processDesignStatus = this.processData["design_status"]
          this.allStepsObject = this.processData['attributes']['steps']
          this.allStepsArray = this.processPreviewServices.getAllStepsArray(this.allStepsObject)
      }
    )
  }

  get allConnectedSteps() {
    return this.processPreviewServices.getConnectedStepsArray(this.allStepsObject, this.allStepsArray)
  }

  get allUnconnectedSteps() {
    return this.allStepsArray.filter(step => !this.allConnectedSteps.includes(step))
  }

  getNewAllStepsObjectReference() {
    const tempProcessData = {...this.processData}
    this.allStepsObject = {...tempProcessData['attributes']['steps']} // NOTE to trigger change detection in process preview
    this.allStepsObject = this.processPreviewServices.getStepsOrder(this.allStepsObject)
  }

  getValidNextSteps() {
    let currenNextSteps: (string | number)[] = Object.keys(this.selectedStep['next_steps'])

    // NOTE the filter statement is not inline function, do not add filter statemetn in {}
    let validNextSteps = this.allStepsArray.filter(item => !currenNextSteps.includes(item))
    validNextSteps = validNextSteps.filter(item => item != this.selectedStepKey)

    return validNextSteps
  }

  addNextStep(stepKey: (string | number)) {
    this.selectedStep['next_steps'][stepKey] = {}
    this.getNewAllStepsObjectReference()
  }

  // Data push functions
  putProcess() {
    console.log('putting')
    this.apiServices.putProcessById(this.processId, this.processData).subscribe();
  }

  // Sidebar funcitons
  getAllStepsList() {
    this.sidebarContent = 'stepsList'
    this.stepSelected = false
    console.log(this.processData)
  }

  getNextStepsListSidebar(stepKey: (string | number) ) {
    this.selectedStepKey = stepKey
    this.selectedStep = this.processData['attributes']['steps'][stepKey]  // NOTE use processData directly because allStepsObject's reference is getting updated to initiate change in process-preview
    this.stepSelected = true
    this.sidebarContent = 'nextStepsList'
  }

}
