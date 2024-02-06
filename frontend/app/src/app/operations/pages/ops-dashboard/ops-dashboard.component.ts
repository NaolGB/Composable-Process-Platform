import { Component } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { IdsListInterface, ProcessInstanceInterface } from '../../../interfaces';
import { Observable } from 'rxjs';
import { OperationsHelperService } from '../../../services/operations-helper.service';

enum MainSectionView {
    SelectProcessInstance = 'SelectProcessInstance',
    SelectStartStep = 'SelectStartStep',
    PerformOperations = 'PerformOperations'
}

@Component({
  selector: 'app-ops-dashboard',
  templateUrl: './ops-dashboard.component.html',
  styleUrl: './ops-dashboard.component.css',
})
export class OpsDashboardComponent {
  processTypeIdsList$: Observable<IdsListInterface> | undefined
  processInstancesByProcessType: ProcessInstanceInterface[] | undefined
  processInstance: ProcessInstanceInterface | undefined

  processType: string = ''
  sidebarType: string = 'read'
  sidebarData: any = {}

  auxiliarySection: boolean = false;
  mainSectionView: MainSectionView = MainSectionView.SelectProcessInstance

  constructor(private apiServices: DataService, private opsHelper: OperationsHelperService) {}

  ngOnInit() {
    this.processTypeIdsList$ = this.apiServices.getProcessTypeIds()
  }

  selectProcessType(id: string) {
    this.processType = id
    this.apiServices.getProcessInstancesByProcessType(id).subscribe(
      response => {
        this.processInstancesByProcessType = response['data']
      }
    )
    this.mainSectionView = MainSectionView.SelectProcessInstance
  }

  selectProcessInstance(processInstanceId: string) {
    if (this.processInstancesByProcessType !== undefined) {
      this.processInstance = this.opsHelper.getProcessInstanceFromProcessInstanceList(processInstanceId, this.processInstancesByProcessType)
      
      if (this.processInstance !== undefined) {
        if (this.processInstance.operations_status === '00_PROCESS_CREATED') {this.mainSectionView = MainSectionView.SelectStartStep}
        else {this.mainSectionView = MainSectionView.PerformOperations}
      }
    }
  }

  toggleAuxiliarySection() {
    this.auxiliarySection = !this.auxiliarySection;
  }

  // showAuxiliarySection(sidebarType: string, sidebarData: {}, metaData: {}) {
  //   // read ops-sidebar componenet docstrinng for input information
  //   this.sidebarType = sidebarType
  //   this.sidebarData = sidebarData
  //   this.auxiliarySection = true
  // }

  createNewProcess(processType: string) {
    this.apiServices.postProcessInstance(processType).subscribe()
  }
}
