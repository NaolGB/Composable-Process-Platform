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
  allStepsObject: ProcessTypeParsedData = {'hi': 'NY!'}
  stepOrder: Object = {}
  canvasHeight: number = 100
  canvasWidth: number = 300
  numMaxRows: number = 0
  numMaxColumns: number = 0

  constructor(private route: ActivatedRoute, private apiServices: DataService, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.processId = this.route.snapshot.paramMap.get('id') || ""
    this.apiServices.getProcessById(this.processId).subscribe(
      (response) => {
          this.processData = response
          this.getStepsOrder()
      }
    )
  }

  ngAfterViewInit() {
    const canvasElement = this.canvas.nativeElement
    this.canvasHeight = canvasElement.height.baseVal.value
    this.canvasWidth = canvasElement.width.baseVal.value
    // this.getStepsOrder()
    this.cd.detectChanges() // detect changes manually because we changed the rectangles' height adn width attribute 
  }

  get rectSize() {
    return this.canvasHeight / ((2*(this.numMaxRows)) + 1)
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
     * 1. determine the connected and unconnected steps
     * 2. for the connected steps, find the start 
     *    - using any first step, traverse through connected steps until you find a step not in any step's next_step
     * 3. set the first step's column as 0
     *    - for all steps that share a next_step with the first step set their column as 0
     *    - after completing the first column, assign each one a unique row
     * 4. repeat step 4 until all connected steps are assigned row and column
     */
    const allStepsObject = this.processData['attributes']['steps']
    const allStepsArray: (string | number)[] = []
    const allConnectedSteps: (string | number)[] = []
    for (const step in allStepsObject) {
      if(!allStepsArray.includes(step)) {
        allStepsArray.push(step)
      }
      allStepsObject[step]['next_steps'].forEach((element: string | number) => {
        if (!allStepsArray.includes(element)) {
          allStepsArray.push(element)
        }
      });
    }

    // get all conneceted and unconnected steps
    allStepsArray.forEach((step) => {
      if (allStepsObject[step]['next_steps'].length > 0) {
        if (!allConnectedSteps.includes(step)) {
          allConnectedSteps.push(step)
        }
        allStepsObject[step]['next_steps'].forEach((element: string | number) => {
          if (!allConnectedSteps.includes(element)) {
            allConnectedSteps.push(element)
          }
        });
      }
    })
    const allUnconnectedSteps: (string | number)[] = allStepsArray.filter(step => !allConnectedSteps.includes(step))

    // find the end steps
    const endSteps: (string | number)[] = []
    allConnectedSteps.forEach((step: string | number) => {
      if (allStepsObject[step]['next_steps'].length == 0) {
        endSteps.push(step)
      }
    })

    // assign rows and columns to connected steps
    let prevSteps: (string | number)[] = endSteps
    let currentColumn = 0
    while (prevSteps.length > 0) {
      const newColumnSteps: (string | number)[] = []
      let currentRow = 0
      prevSteps.forEach((currS) => {
        allStepsObject[currS]['row'] = currentRow
        allStepsObject[currS]['column'] = currentColumn
        allConnectedSteps.forEach((prevS) => {
          if (allStepsObject[prevS]['next_steps'].includes(currS)) {
            newColumnSteps.push(prevS)
          }
        })
        currentRow += 1
        if(currentRow > this.numMaxRows) {this.numMaxRows = currentRow}
      })
      prevSteps = newColumnSteps
      currentColumn -= 1
    }
    const connectedColumns = Math.abs(currentColumn)
    if(connectedColumns > this.numMaxColumns) {this.numMaxColumns = connectedColumns}
    allConnectedSteps.forEach((step) => { // reset columns to start from 0
      allStepsObject[step]['column'] = allStepsObject[step]['column'] + connectedColumns - 1
    })

    // assign rows and columns to unconnected steps
    if(allUnconnectedSteps.length > 0) {
      const numUnconnectedRows = Math.ceil(Math.sqrt(allUnconnectedSteps.length))
      if(numUnconnectedRows > this.numMaxRows) {this.numMaxRows = numUnconnectedRows}
      // allUnconnectedSteps.forEach(step)
      for (let r=0; r<numUnconnectedRows; r++) {
        for (let c=0; c<numUnconnectedRows; c++) {
          allStepsObject[allUnconnectedSteps[r+c]]['row'] = r
          allStepsObject[allUnconnectedSteps[r+c]]['column'] = c + connectedColumns
          if(c+connectedColumns > this.numMaxColumns) {this.numMaxColumns = c+connectedColumns}
        }
      }
    }

    // update max number or rows (to update the rectangle sizes with)
    
    

    // console.log(allConnectedSteps, allUnconnectedSteps, endSteps)
    console.log(allStepsObject)
    // this.cd.detectChanges()

  }

}
