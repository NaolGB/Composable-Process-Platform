import { Component } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { ProcessTypeParsedData } from '../../../interfaces';

@Component({
  selector: 'app-ops-dashboard',
  templateUrl: './ops-dashboard.component.html',
  styleUrl: './ops-dashboard.component.css',
})
export class OpsDashboardComponent {
  // Navigation section variables
  processTypeIds: (string | number)[] = [];
  selectedProcessTypeId: string | number = '';

  // Main section variables
  mainSectionFocus: string = 'processInformaiton';
  selectedProcessInstances: string[] = [];
  selectedProcessInstance: any = {}
  selectedProcessInstanceCurrentOperationsStatus: string = ''
  constructor(private apiServices: DataService) {}

  ngOnInit() {
    this.apiServices.getProcessTypeIds().subscribe((response) => {
      this.processTypeIds = response['ids'];
    });
  }

  // Main section functions
  selectProcess(id: string | number) {
    this.selectedProcessTypeId = id;
    this.getProcessInstances(id);
    // determine process from next_steps
    // present current steps's documents and their elements
  }

  createNewProcessInstance(processTypeId: string | number) {
    this.apiServices.postProcessInstanceById(processTypeId).subscribe();
  }

  getProcessInstances(processTypeId: string | number) {
    this.apiServices
      .getProcessInstanceIdsByProcessTypeId(processTypeId)
      .subscribe((response) => {
        this.selectedProcessInstances = response['data'];
      });
  }

  selectProcessInstance(processInstanceId: string | number) {
    this.apiServices.getProcessInstanceById(processInstanceId).subscribe(
      (response) => {
        this.selectedProcessInstance = response['data']
        this.selectedProcessInstanceCurrentOperationsStatus = this.selectedProcessInstance['operations_status']
        console.log(this.selectedProcessInstanceCurrentOperationsStatus)
      }
    )
  }
}
