import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { ProcessInstanceInterface, ProcessStepInterface } from '../../../interfaces';

@Component({
  selector: 'app-ops-dashboard',
  templateUrl: './ops-dashboard.component.html',
  styleUrl: './ops-dashboard.component.css',
})
export class OpsDashboardComponent {
  // Navigation section variables
  processTypeIds: (string)[] = [];
  selectedProcessTypeId: string = '';

  // Main section variables
  mainSectionFocus: string = 'processInformaiton';
  selectedProcessTypeInstanceIds: string[] = [];
  selectedProcessInstance!: ProcessInstanceInterface;
  selectedStepEventType: string = ''
  selectedStepObject!: ProcessStepInterface;

  constructor(private apiServices: DataService, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.apiServices.getProcessTypeIds().subscribe((response) => {
      this.processTypeIds = response['ids'];
    });
  }

  // Main section functions
  selectProcess(id: string) {
    this.selectedProcessTypeId = id;
    this.getProcessTypeInstanceIds(id);
  }

  createNewProcessInstance(processTypeId: string) {
    this.apiServices.postProcessInstanceById(processTypeId).subscribe();
  }

  getProcessTypeInstanceIds(processTypeId: string) {
    this.apiServices
      .getProcessInstanceIdsByProcessTypeId(processTypeId)
      .subscribe((response) => {
        this.selectedProcessTypeInstanceIds = response['ids'];
      });
  }

  selectProcessInstance(processInstanceId: string) {
    this.apiServices.getProcessInstanceById(processInstanceId).subscribe(
      (response) => {
        this.selectedProcessInstance = response
        this.mainSectionFocus = 'processOperationsSelectStep'
      }
    )
  }

  getStartSteps() {
    const allSteps = Object.keys(this.selectedProcessInstance['steps'])
    const startSteps = allSteps.filter(step => this.selectedProcessInstance['steps'][step]['edge_status'] === '01_START')
    return startSteps
  }

  selectOperationsStep(step: string) {
    this.selectedStepObject = this.selectedProcessInstance['steps'][step]
    this.selectedProcessInstance['operations_status'] = step
    this.selectedStepEventType = this.selectedStepObject['event_type']
    this.mainSectionFocus = 'processOperationsAction'
  }


  // Angular check functions
  trackByStepDocument(index: number, item: any): string {
    return item.key; 
  }

  trackByAttribute(index: number, item: any): string {
      return item.key; 
  }

  check(sth: any) {
    console.log(sth)
  }

}
