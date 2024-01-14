import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../../../services/data.service';
import { ProcessTypeParsedData } from '../../../../interfaces';

@Component({
  selector: 'app-connect',
  templateUrl: './connect.component.html',
  styleUrl: './connect.component.css'
})
export class ConnectComponent {
  @ViewChild('canvas') canvas!: ElementRef;
  processId: string = ''
  processData: ProcessTypeParsedData = {}
  stepOrder: Array<Array<String>> = []
  canvasHeight: number = 100
  canvasWidth: number = 300
  numRows: number = 0
  numColumns: number = 0

  constructor(private route: ActivatedRoute, private apiServices: DataService, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.processId = this.route.snapshot.paramMap.get('id') || ""
    this.apiServices.getProcessById(this.processId).subscribe(
      (response) => {
          this.processData = response
          this.getStepsOrder()

          this.numColumns = this.stepOrder.length
          this.stepOrder.forEach(step => {
            if (step.length > this.numRows) {
              this.numRows = step.length;
            }
          });
      }
    )
  }

  ngAfterViewInit() {
    const canvasElement = this.canvas.nativeElement
    this.canvasHeight = canvasElement.height.baseVal.value
    this.canvasWidth = canvasElement.width.baseVal.value

    this.cd.detectChanges() // detect changes manually because we changed the rectangles' height adn width attribute 
  }

  get rectHeight() {
    return this.canvasHeight / ((2*(this.numColumns,this.numRows)) + 1)
  }

  getStepsOrder() {
    for (const key in this.processData['attributes']['steps']) {
      this.stepOrder.push([key])
    }
  }

}
