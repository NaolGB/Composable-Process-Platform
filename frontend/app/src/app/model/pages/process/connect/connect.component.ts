import { ChangeDetectorRef, Component, ElementRef, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../../../services/data.service';
import { ProcessTypeParsedData } from '../../../../interfaces';
import { ProcessPreviewService } from '../../../../services/process-preview.service';
import { FormArray, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-connect',
  templateUrl: './connect.component.html',
  styleUrl: './connect.component.css'
})
export class ConnectComponent {
  @ViewChild('canvas') canvas!: ElementRef;
  processId: string = ''
  processData: ProcessTypeParsedData = {}
  allStepsObject: ProcessTypeParsedData = {}
  allConnectedSteps: (string | number)[] = []
  allUnconnectedSteps: (string | number)[] = []
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
          this.allStepsObject = this.processData['attributes']['steps']
          this.allStepsObject = this.processPreviewServices.getStepsOrder(this.allStepsObject)
          this.allStepsArray = this.processPreviewServices.getAllStepsArray(this.allStepsObject)
          this.allConnectedSteps = this.processPreviewServices.getConnectedStepsArray(this.allStepsObject, this.allStepsArray)
          this.allUnconnectedSteps = this.allStepsArray.filter(step => !this.allConnectedSteps.includes(step))
      }
    )
  }

  getNewAllStepsObjectReference() {
    const tempProcessData = {...this.processData}
    this.allStepsObject = {...tempProcessData['attributes']['steps']} // NOTE to trigger change detection in process preview
    this.allStepsObject = this.processPreviewServices.getStepsOrder(this.allStepsObject)
  }

  getValidNextSteps() {
    let validNextSteps = this.allStepsArray.filter(item => !this.selectedStep['next_steps'].includes(item))
    validNextSteps = validNextSteps.filter(item => item !== this.selectedStepKey)
    return validNextSteps
  }

  addNextStep(stepKey: (string | number)) {
    this.selectedStep['next_steps'].push(stepKey)
    this.getNewAllStepsObjectReference()
  }

  getNextStepsListSidebar(stepKey: (string | number) ) {
    this.selectedStepKey = stepKey
    this.selectedStep = this.processData['attributes']['steps'][stepKey]  // NOTE use processData directly because allStepsObject's reference is getting updated to initiate change in process-preview
    this.stepSelected = true
    this.sidebarContent = 'addNextStepsForm'
  }

  getSidebarTransitionLogicSidebar() {
    console.log(this.selectedStep)
    console.log(this.allStepsObject)
    console.log(this.processData)
    this.cd.detectChanges();
  }

}
