import { Component } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { DocumentInstanceInterface, IdsListInterface, ProcessInstanceInterface, SidebarPackage } from '../../../interfaces';
import { Observable } from 'rxjs';
import { OperationsHelperService } from '../../../services/operations-helper.service';

enum MainSectionView {
    SelectProcessInstance = 'SelectProcessInstance',
    SelectStartStep = 'SelectStartStep',
    PerformOperations = 'PerformOperations'
}

enum StepEdgeStatus {
  NotEdge = '00_NOT_EDGE',
  StartEdge = '01_START'
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
  startSteps: string[] = []
  sidebarType: string = 'read'
  sidebarPackage: SidebarPackage | undefined

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
        if (this.processInstance.operations_status === '00_PROCESS_CREATED') {
          this.startSteps = []
          Object.keys(this.processInstance.steps).forEach(element => {
            if (this.processInstance?.steps[element].edge_status === StepEdgeStatus.StartEdge) {
              this.startSteps.push(element)
            }
          })
          this.mainSectionView = MainSectionView.SelectStartStep
        }
        else {this.mainSectionView = MainSectionView.PerformOperations}
      }
    }
  }

  selectStartStep(step: string) {
    if (this.processInstance !== undefined) {
      this.processInstance.operations_status = step
      this.mainSectionView = MainSectionView.PerformOperations
    }
  }

  toggleAuxiliarySection() {
    this.auxiliarySection = !this.auxiliarySection;
  }

  destroyAuxiliarySection() {
    this.sidebarPackage = undefined
    this.auxiliarySection = false
  }

  showAuxiliarySectionCreateDocumnent(documentName: string) {
    if (this.processInstance != undefined) {
      const data = this.processInstance.document_instances[documentName]
      const editableFields = this.processInstance.steps[this.processInstance.operations_status].fields[documentName].document_fields
      this.sidebarPackage = {
        identifier: documentName,
        sidebarType: 'create',
        contentType: 'document',
        sidebarData: data,
        metaData: {editableFields: editableFields}
      }
      this.auxiliarySection = true
    }
  }

  applySidebarEffectsCreateDocument($event: SidebarPackage) {
    if (this.processInstance != undefined) {
      this.processInstance.document_instances[$event.identifier] = $event.sidebarData as DocumentInstanceInterface
      this.destroyAuxiliarySection()
    }
    console.log(this.processInstance)
  }

  createNewProcess(processType: string) {
    this.apiServices.postProcessInstance(processType).subscribe()
  }
}
