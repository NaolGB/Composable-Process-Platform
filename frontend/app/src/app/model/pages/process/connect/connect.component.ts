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
  allStepsObject: ProcessTypeParsedData = {}
  allConnectedSteps: (string | number)[] = []
  allUnconnectedSteps: (string | number)[] = []

  constructor(private route: ActivatedRoute, private apiServices: DataService, private cd: ChangeDetectorRef, private processPreviewServices: ProcessPreviewService) {}

  ngOnInit() {
    this.processId = this.route.snapshot.paramMap.get('id') || ""
    this.apiServices.getProcessById(this.processId).subscribe(
      (response) => {
          this.processData = response
          this.allStepsObject = this.processData['attributes']['steps']
          this.allStepsObject = this.processPreviewServices.getStepsOrder(this.allStepsObject)
          const allSteps = this.processPreviewServices.getAllStepsArray(this.allStepsObject)
          this.allConnectedSteps = this.processPreviewServices.getConnectedStepsArray(this.allStepsObject, allSteps)
          this.allUnconnectedSteps = allSteps.filter(step => !this.allConnectedSteps.includes(step))
      
          console.log(this.allConnectedSteps, this.allUnconnectedSteps)

      }
    )
  }

  ngAfterViewInit() {
    this.cd.detectChanges()
  }

}
