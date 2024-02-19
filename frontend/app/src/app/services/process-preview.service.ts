import { Injectable } from '@angular/core';
import { ProcessStepInterface, ProcessTypeInterface } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class ProcessPreviewService {

  constructor() { }

  getAllStepsArray(allStepsObject: { [key: string]: ProcessStepInterface; }) {
    const allStepsArray: string[] = []
    
    Object.keys(allStepsObject).forEach(step => {
      if(!allStepsArray.includes(step)) {
        allStepsArray.push(step)
      }
      allStepsObject[step]['next_steps']['steps'].forEach((element: string ) => {
        if (!allStepsArray.includes(element)) {
          allStepsArray.push(element)
        }
      });
    })
    return allStepsArray
  }

  getConnectedStepsArray(allStepsObject: { [key: string]: ProcessStepInterface; }, allStepsArray: string []) {
    const allConnectedSteps: string [] = []
    allStepsArray.forEach((step) => {
      if (allStepsObject[step]['next_steps']['steps'].length > 0) {
        if (!allConnectedSteps.includes(step)) {
          allConnectedSteps.push(step)
        }
        allStepsObject[step]['next_steps']['steps'].forEach((element: string ) => {
          if (!allConnectedSteps.includes(element)) {
            allConnectedSteps.push(element)
          }
        });
      }
    })

    return allConnectedSteps
  }

  getTransitionLines(allStepsObject: { [key: string]: ProcessStepInterface; }) {
    allStepsObject = this.getStepsOrder(allStepsObject)
    const lines: {[key: string]: any} = {}
    Object.keys(allStepsObject).forEach(step => {
      allStepsObject[step]['next_steps']['steps'].forEach((nextStep: string ) => {
        let fromRow: number  = allStepsObject[step]['row']
        let toRow: number  = allStepsObject[nextStep]['row']
        let fromColumn: number  = allStepsObject[step]['column']
        let toColumn: number  = allStepsObject[nextStep]['column']

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

  getStartAndEndSteps(allStepsObject: { [key: string]: ProcessStepInterface; }) {
    // TODO: adopt to TS convention - translated from Python
    const allStepsArray: string [] = this.getAllStepsArray(allStepsObject)
    const allConnectedSteps: string [] = this.getConnectedStepsArray(allStepsObject, allStepsArray)
    const allUnconnectedSteps: string [] = allStepsArray.filter(step => !allConnectedSteps.includes(step))

    const all_steps_progress_count: { [step: string]: { goes_to: number, comes_from: number } } = {};

    for (const step of allStepsArray) {
      all_steps_progress_count[step] = { goes_to: 0, comes_from: 0 };
    }
    
    for (const step of allConnectedSteps) {
        const next_steps = allStepsObject[step]['next_steps']['steps'];
        all_steps_progress_count[step]['goes_to'] = next_steps.length;
        
        for (const n_step of next_steps) {
            all_steps_progress_count[n_step]['comes_from'] += 1;
        }
    }

    const startAndEndSteps: {[key: string]: string[]} = {'startSteps': [], 'endSteps': []}
    for (const step of allConnectedSteps) {
      if (all_steps_progress_count[step]['goes_to'] === 0) {
        // allStepsObject[step]['edge_status'] = "02_END";
            startAndEndSteps['endSteps'].push(step)
        }
        if (all_steps_progress_count[step]['comes_from'] === 0) {
            // allStepsObject[step]['edge_status'] = "01_START";
            startAndEndSteps['startSteps'].push(step)
        }
    }

    console.log(startAndEndSteps)
    return startAndEndSteps
  }

  getStepsOrder(allStepsObject: { [key: string]: ProcessStepInterface; }) {
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
    
    const allStepsArray: string [] = this.getAllStepsArray(allStepsObject)
    const allConnectedSteps: string [] = this.getConnectedStepsArray(allStepsObject, allStepsArray)
    const allUnconnectedSteps: string [] = allStepsArray.filter(step => !allConnectedSteps.includes(step))

    // find start steps
    const startAndEndSteps = this.getStartAndEndSteps(allStepsObject)

    let currentColumn = 0
    const startSteps = startAndEndSteps['startSteps']
    let currentSteps = [...startSteps]
    

    while (currentSteps.length > 0) {
      let nextSteps: string[] = []
      console.log(currentSteps, currentColumn)
      currentSteps.forEach(step => {
        allStepsObject[step]['column'] = currentColumn

        // collect next column steps
        allStepsObject[step].next_steps.steps.forEach(element => {
          nextSteps.push(element)
        })
      })

      let currentRow = 0
      currentSteps.forEach(element => {
        allStepsObject[element]['row'] = currentRow
        currentRow += 1
      })

      currentColumn += 1
      currentSteps = [...nextSteps]
    }

    const connectedColumns = Math.abs(currentColumn)

    // assign (r, c) to unconnected steps
    if (allUnconnectedSteps.length > 0) {
      const numUnconnectedRows = Math.ceil(Math.sqrt(allUnconnectedSteps.length));
    
      for (let r = 0; r <= numUnconnectedRows; r++) {
        for (let c = 0; c <= numUnconnectedRows; c++) {
          const index = r * numUnconnectedRows + c;
    
          if (index < allUnconnectedSteps.length) {
            allStepsObject[allUnconnectedSteps[index]]['row'] = r;
            allStepsObject[allUnconnectedSteps[index]]['column'] = c + connectedColumns;
          }
        }
      }
    }
    
    console.log(allStepsObject)
    return allStepsObject
  }

}
