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
    /**
     * Sorts steps into rows and columns for process preview. 
     * Step order is determined based on their next_step values. 
     *  - steps that are in other steps' next_step have a higher colimn than their source step 
     *    -- (eg: if step b is in step a's next_step object, step b's column is one after step a's)
     *  - steps that come from the same step (eg: two steps in another step's next_step object) have the same column
     *  - steps that share next_step (eg: two steps that have at least one common next_step value) have the same column
     * 
     * stepOrder is an object that holds the step name (which is used as it's key) and order information. It reffers to 
     * the process data with 1-to-1 binding and has the following structure.
     * {
     *  a: {
     *        row: 0,
     *        column: 0
     *        next_steps: {b, c}
     *      }
     *  b: {
     *        row: 0,
     *        column: 1
     *        next_steps: {}
     *      }
     *  c: {
     *        row: 0,
     *        column: 0
     *        next_steps: {}
     *      }
     * }
     * 
     * stepOrder's rows and columns are determined with the following method.
     * 1. determine the connected adn unconnected steps
     * 2. for the connected steps, find the start 
     *    - using any first step, traverse through connected steps until you find a step not in any step's next_step
     * 3. set the first step's column as 0
     *    - for all steps that share a next_step with the first step set their column as 0
     *    - after completing the first column, assign each one a unique row
     * 4. repeat step 4 until all connected steps are assigned row and column
     */
    for (const key in this.processData['attributes']['steps']) {
      this.stepOrder.push([key])
    }


    
  }

}
