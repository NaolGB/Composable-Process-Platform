import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, SimpleChanges, ViewChild } from '@angular/core';
import { ProcessTypeParsedData } from '../../interfaces';

@Component({
  selector: 'app-process-preview',
  changeDetection: ChangeDetectionStrategy.OnPush, // NOTE OnPush change detection strategy to listen to allStepsObjects manually
  templateUrl: './process-preview.component.html',
  styleUrl: './process-preview.component.css'
})
export class ProcessPreviewComponent {
  @ViewChild('canvas') canvas!: ElementRef
  // needs to be set to ProcessTypeParsedData to access row and column values in the template
  // needs to be set to undefined because any trhrows an error when row and column are accessed in the template
  @Input() allStepsObject: ProcessTypeParsedData | undefined 

  stepOrder: Object = {}
  canvasHeight: number = 0
  canvasWidth: number = 0

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit() {
    console.log('process-preview init')
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['allStepsObject']) {
      console.log('process-preview cahgnes')
    }
  }

  ngAfterViewInit() {
    const canvasElement = this.canvas.nativeElement
    this.canvasHeight = canvasElement.height.baseVal.value
    this.canvasWidth = canvasElement.width.baseVal.value
    this.cd.detectChanges() // detect changes manually because we changed the rectangles' height and width attribute 
  }

  get rectSize() {
    let rectSize = 0
    if(this.numMaxColumns > this.numMaxRows){
      rectSize = this.canvasWidth / ((this.numMaxColumns*2)+1)
    }
    else {
      rectSize = this.canvasHeight / ((this.numMaxRows*2)+1)
    }
    return rectSize/1.25
  }

  get numMaxRows() {
    let retVal = 1
    for(const step in this.allStepsObject) {
      if(this.allStepsObject[step]['row'] > retVal){retVal=this.allStepsObject[step]['row']}
    }
    return retVal+1
  }

  get numMaxColumns() {
    let retVal = 1
    for(const step in this.allStepsObject) {
      if(this.allStepsObject[step]['column'] > retVal){retVal=this.allStepsObject[step]['column']}
    }
    return retVal+1
  }
}
