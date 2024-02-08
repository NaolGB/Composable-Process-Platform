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

  createNewProcess(processType: string) {
    this.apiServices.postProcessInstance(processType).subscribe()
  }

  updateProcessInstance() {
    this.apiServices.putProcessInstance(this.processType, this.processInstance).subscribe()
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
      const allFields = Object.keys(this.processInstance.document_instances[documentName])
      const editableFields = this.processInstance.steps[this.processInstance.operations_status].fields[documentName].document_fields
      this.sidebarPackage = {
        identifier: documentName,
        sidebarType: 'create',
        selector: {selectorType: 'document_instance', selectorId: ''},
        content: {
          allFields: allFields,
          editableFields: editableFields
        },
        sidebarData: data,
      }
      this.auxiliarySection = true
    }
  }

  showAuxiliarySectionCreateDocumentMasterData(documentId: string) {
    if (this.processInstance != undefined) {
      const allFields = this.processInstance.document_instances[documentId].lead_object_fields
      const editableFields = this.processInstance.steps[this.processInstance.operations_status].fields[documentId].lead_object_fields
      this.sidebarPackage = {
        identifier: documentId,
        sidebarType: 'create_from_selector',
        selector: {
          selectorType: 'master_instance',
          // identifies the document instance where the lead object is located (to save the corresponding master data entries)
          selectorPath: {
            'processInstanceId': this.processInstance._id,
            'documentId': documentId,
          },
          // identifies the document instance's lead object (to fetch the corresponding master data entries)
          selectorId: this.processInstance.document_instances[documentId].lead_object 
        },
        content: {
          allFields: allFields,
          editableFields: editableFields
        },
        sidebarData: undefined,
      }
      this.auxiliarySection = true
    }
  }

  applySidebarEffects($event: SidebarPackage) {
    if ((this.processInstance != undefined) && (this.sidebarPackage != undefined)) {
      if ((this.sidebarPackage.sidebarType === 'create') || (this.sidebarPackage.sidebarType === 'create_from_selector')) {

        if (this.sidebarPackage.selector.selectorType === 'document_instance') {
          this.processInstance.document_instances[$event.identifier] = $event.sidebarData as DocumentInstanceInterface
        }

        else if (($event.selector.selectorType === 'master_instance') && ($event.sidebarData)) {
          this.processInstance.document_instances[$event.selector.selectorPath!['documentId']][
            $event.selector.selectorId+'s'][$event.sidebarData['_id']] = $event.sidebarData
        }

        this.destroyAuxiliarySection()
      }
    }
  }
}
