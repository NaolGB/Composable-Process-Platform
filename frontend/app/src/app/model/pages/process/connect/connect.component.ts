import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
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
  selectedStep: (string | number) = ''
  selectedNextStep: (string | number) = ''
  stepSelected: boolean = false
  sidebarContent: string = 'stepsList'

  stepsForm = this.formBuilder.group({
    stepsArray: this.formBuilder.array([])
  })

  constructor(
    private route: ActivatedRoute, 
    private apiServices: DataService, 
    private cd: ChangeDetectorRef, 
    private processPreviewServices: ProcessPreviewService,
    private formBuilder: FormBuilder
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

  ngAfterViewInit() {
    this.cd.detectChanges()
  }

  getStepForm(step: (string | number) ) {
    this.selectedStep = step
    this.stepSelected = !this.stepSelected
  }

  get stepsArray() {
    return this.stepsForm.get("stepsArray") as FormArray
  }

  addNextStep() {
    this.stepsArray.push(
      this.formBuilder.group({
        step: ['', Validators.required]
      })
    )
  }

  getSidebarTransitionLogic() {
    this.sidebarContent = 'transitionLogic'
  }

}
