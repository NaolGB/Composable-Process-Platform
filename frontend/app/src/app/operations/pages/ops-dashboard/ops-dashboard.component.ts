import { Component } from '@angular/core';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'app-ops-dashboard',
  templateUrl: './ops-dashboard.component.html',
  styleUrl: './ops-dashboard.component.css'
})
export class OpsDashboardComponent {
  // Navigation section variables
  processTypeIds: (string|number)[] = []
  selectedProcessTypeId: string | number = ''
  
  // Main section variables
  mainSectionFocus: string = 'processInformaiton'

  constructor(private apiServices: DataService) {}

  ngOnInit() {
    this.apiServices.getProcessTypeIds().subscribe(
      (response) => {
        this.processTypeIds = response['ids']
      }
    )
  }

  // Main section functions
  selectProcess(id: string | number) {
    this.selectedProcessTypeId = id
  }

  createNewProcessInstance(processTypeId: string | number) {
    this.apiServices.postProcessInstanceById(processTypeId).subscribe()
  }

}
