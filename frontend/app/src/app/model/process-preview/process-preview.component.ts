import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, SimpleChanges, ViewChild } from '@angular/core';
import { ProcessPreviewService } from '../../services/process-preview.service';
import { ProcessStepInterface, ProcessTypeInterface } from '../../interfaces';

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
  @Input()
  allStepsObject!: { [key: string]: ProcessStepInterface; };

  stepOrder: Object = {}
  transitionLines: {[key: string]: any} = {}
  canvasHeight: number = 0
  canvasWidth: number = 0
  allStepsArray: string [] = []
  allConnectedSteps: string [] = []
  allUnconnectedSteps: string [] = []
  padding: number = 25; // padding value in pixels
  internalPadding = 25 // padding between rectangles

  constructor(private cd: ChangeDetectorRef, private processPreviewServices: ProcessPreviewService,) {}

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['allStepsObject']) {
      this.allStepsArray = this.processPreviewServices.getAllStepsArray(this.allStepsObject)
      this.allConnectedSteps = this.processPreviewServices.getConnectedStepsArray(this.allStepsObject, this.allStepsArray)
      this.allUnconnectedSteps = this.allStepsArray.filter(step => !this.allConnectedSteps.includes(step))
      this.transitionLines = this.processPreviewServices.getTransitionLines(this.allStepsObject)
    }
  }

  ngAfterViewInit() {
    const canvasElement = this.canvas.nativeElement
    this.canvasHeight = canvasElement.height.baseVal.value
    this.canvasWidth = canvasElement.width.baseVal.value
    this.allStepsObject =  this.processPreviewServices.getStepsOrder(this.allStepsObject)

    this.cd.detectChanges() // detect changes manually because we changed the rectangles' height and width attribute 
  }

  getArrowHeadPoints(line:{[key: string]: number}) {
    let x1 = (((this.canvasWidth/(this.numMaxColumns+1)) * (line['toColumn'])))- (this.rectSize/3)
    let y1 = (((((this.canvasHeight/(this.numMaxRows+1)) * (line['toRow']))) + (this.rectSize/2))) - (this.rectSize/3/2)
    let y2 = y1 + (this.rectSize/3)
    let x3 = x1 + (this.rectSize/3)
    let y3 = y1 + ((y2 - y1) / 2)
    
    return `${x1},${y1} ${x1},${y2} ${x3},${y3}`
  }

  get rectSize() {
    console.log(this.numMaxRows, this.numMaxColumns)
    console.log(this.allStepsObject)
    // Calculate the maximum number of rectangles per row and column
    const maxRectsPerRow = this.numMaxColumns; // Assuming numMaxColumns accounts for the layout correctly
    const maxRectsPerColumn = this.numMaxRows; // Assuming numMaxRows accounts for the layout correctly

    // Determine the available width and height per rectangle, considering some padding
    const availableWidthPerRect = (this.canvasWidth / maxRectsPerRow )- (this.padding * 2);
    const availableHeightPerRect = (this.canvasHeight / maxRectsPerColumn) - (this.padding * 2);

    // Use the smaller of the two dimensions to ensure rectangles fit both ways
    return Math.min(availableWidthPerRect, availableHeightPerRect);
  }

  get numMaxRows() {
    let retVal = 1
    for(const step in this.allStepsObject) {
      if(this.allStepsObject[step]['row'] > retVal){retVal=this.allStepsObject[step]['row']}
    }
    return retVal + 1
  }

  get numMaxColumns() {
    let retVal = 1
    for(const step in this.allStepsObject) {
      if(this.allStepsObject[step]['column'] > retVal){retVal=this.allStepsObject[step]['column']}
    }
    return retVal + 1
  }
}
