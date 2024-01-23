import { Injectable } from '@angular/core';
import { ProcessTypeParsedData } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class ProcessPreviewService {

  constructor() { }

  getAllStepsArray(allStepsObject: ProcessTypeParsedData | any) {
    const allStepsArray: (string | number)[] = []
    
    Object.keys(allStepsObject).forEach(step => {
      if(!allStepsArray.includes(step)) {
        allStepsArray.push(step)
      }
      allStepsObject[step]['next_steps']['steps'].forEach((element: string | number) => {
        if (!allStepsArray.includes(element)) {
          allStepsArray.push(element)
        }
      });
    })
    return allStepsArray
  }

  getConnectedStepsArray(allStepsObject: ProcessTypeParsedData | any, allStepsArray: (string | number)[]) {
    const allConnectedSteps: (string | number)[] = []
    allStepsArray.forEach((step) => {
      if (allStepsObject[step]['next_steps']['steps'].length > 0) {
        if (!allConnectedSteps.includes(step)) {
          allConnectedSteps.push(step)
        }
        allStepsObject[step]['next_steps']['steps'].forEach((element: string | number) => {
          if (!allConnectedSteps.includes(element)) {
            allConnectedSteps.push(element)
          }
        });
      }
    })

    return allConnectedSteps
  }

  getTransitionLines(allStepsObject: ProcessTypeParsedData | any) {
    allStepsObject = this.getStepsOrder(allStepsObject)
    const lines: {[key: string]: any} = {}
    Object.keys(allStepsObject).forEach(step => {
      allStepsObject[step]['next_steps']['steps'].forEach((nextStep: string | number) => {
        let fromRow: (string | number) = allStepsObject[step]['row']
        let toRow: (string | number) = allStepsObject[nextStep]['row']
        let fromColumn: (string | number) = allStepsObject[step]['column']
        let toColumn: (string | number) = allStepsObject[nextStep]['column']

        lines[`${fromRow}${fromColumn}${toRow}${toColumn}`] = ({
          fromRow: allStepsObject[step]['row'],
          toRow: allStepsObject[nextStep]['row'],
          fromColumn: allStepsObject[step]['column'],
          toColumn: allStepsObject[nextStep]['column']
        })
      })
    })
    
    return lines
  }

  getStepsOrder(allStepsObject: ProcessTypeParsedData | any) {
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
    
    const allStepsArray: (string | number)[] = this.getAllStepsArray(allStepsObject)
    const allConnectedSteps: (string | number)[] = this.getConnectedStepsArray(allStepsObject, allStepsArray)
    const allUnconnectedSteps: (string | number)[] = allStepsArray.filter(step => !allConnectedSteps.includes(step))

    // find the end steps
    const endSteps: (string | number)[] = []
    allConnectedSteps.forEach((step: string | number) => {
      if (Object.keys(allStepsObject[step]['next_steps']['steps']).length == 0) {
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
          let prevStep_sNextSteps: (string | number)[] = allStepsObject[prevS]['next_steps']['steps']
          if (prevStep_sNextSteps.includes(currS)) {
            newColumnSteps.push(prevS)
          }
        })
        currentRow += 1
      })
      prevSteps = newColumnSteps
      currentColumn -= 1
    }
    const connectedColumns = Math.abs(currentColumn)
    // if(connectedColumns > numMaxColumns) {numMaxColumns = connectedColumns}
    allConnectedSteps.forEach((step) => { // reset columns to start from 0
      allStepsObject[step]['column'] = allStepsObject[step]['column'] + connectedColumns - 1
    })

    // assign rows and columns to unconnected steps
    if (allUnconnectedSteps.length > 0) {
      const numUnconnectedRows = Math.ceil(Math.sqrt(allUnconnectedSteps.length));
    
      for (let r = 0; r < numUnconnectedRows; r++) {
        for (let c = 0; c < numUnconnectedRows; c++) {
          const index = r * numUnconnectedRows + c;
    
          if (index < allUnconnectedSteps.length) {
            allStepsObject[allUnconnectedSteps[index]]['row'] = r;
            allStepsObject[allUnconnectedSteps[index]]['column'] = c + connectedColumns;
          }
        }
      }
    }

    return allStepsObject
  }

}
