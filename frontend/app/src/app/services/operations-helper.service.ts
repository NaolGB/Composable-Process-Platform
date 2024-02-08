import { Injectable } from '@angular/core';
import { ProcessInstanceInterface } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class OperationsHelperService {

  constructor() { }

  getProcessInstanceFromProcessInstanceList(processInstanceId: string, processInstanceList: ProcessInstanceInterface[]): ProcessInstanceInterface | undefined {
    /**
     * given process intance list (GET on event in the ProcessEngine returns `data` which contains list of process intances)
     * get a specific process intance adn return the object of the process instance
     */
    let foundInstance: ProcessInstanceInterface | undefined;

    processInstanceList.forEach(element => {
      if (element['_id'] === processInstanceId) {
        foundInstance = element;
      }
    })

    return foundInstance
  }

  getMasterDataFromMasterDataList(masterDataId: string, masterDataList: any[]) {
    let foundData: any;

    masterDataList.forEach(element => {
      if (element['_id'] === masterDataId) {
        foundData = element
      }
    })

    return foundData
  }

}
