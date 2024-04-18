import { Component } from '@angular/core';
import { OperationApiService } from '../../services/operation-api.service';
import { DesignApiService } from '../../../design/services/design-api.service';
import { CommonModule } from '@angular/common';
import { TableDataInterface } from '../../../interfaces/design-interfaces';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'app-operation-process-home',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './operation-process-home.component.html',
  styleUrl: './operation-process-home.component.scss'
})
export class OperationProcessHomeComponent {
  processInstanceList: any[] = [];
  processTypeList: any[] = [];
  selectedProcessTypeId: string = '__button_process_type_overview';

  processInstanceOverviewTable: TableDataInterface | undefined;
  filteredProcessInstanceOverviewTable: TableDataInterface | undefined;

  constructor(
    private operationAiService: OperationApiService,
    private designApiService: DesignApiService,
    private dataService: DataService
  ) {}

  ngOnInit()  {
    this.designApiService.getMasterDataTypeList().subscribe(
      (response: any) => {
        this.processTypeList = response;
        this.selectedProcessTypeId = this.processTypeList[0]._id;
        this.onProcessTypeSelected(this.selectedProcessTypeId);
      },
      (error: any) => {
        console.log('Error: ', error);
      }
    );
  }

  onProcessTypeSelected(processTypeId: string) {
    this.selectedProcessTypeId = processTypeId;

    this.operationAiService.getProcessInstanceList(processTypeId).subscribe(
      (response: any) => {
        this.processInstanceList = response;
      },
      (error: any) => {
        console.log('Error: ', error);
      }
    );
  }

  onFilterTextChange(event: KeyboardEvent) {
		const filterText = (event.target as HTMLInputElement).value;
		if (this.processInstanceOverviewTable) {
			this.filteredProcessInstanceOverviewTable = this.dataService.filterTableData(
			  this.processInstanceOverviewTable,
			  filterText
			);
		}
	}
}
