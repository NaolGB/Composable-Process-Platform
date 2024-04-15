import { Component } from '@angular/core';
import { DesignApiService } from '../../services/design-api.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TableComponent } from '../../../components/table/table.component';
import { TableDataInterface } from '../../../interfaces/design-interfaces';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'app-design-process-home',
  standalone: true,
  imports: [
    CommonModule,
    TableComponent
  ],
  templateUrl: './design-process-home.component.html',
  styleUrl: './design-process-home.component.scss'
})
export class DesignProcessHomeComponent {
  processTypeList: any[] = [];
  selectedProcessTypeId: string = '__button_process_type_overview';

  overviewProcessTypeOverviewTable: TableDataInterface | undefined;
  filteredProcessTypeOverviewTable: TableDataInterface | undefined;

  constructor(
    private designApiService: DesignApiService,
    private router: Router,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.designApiService.getProcessTypeList().subscribe(
      (response: any) => {
        this.processTypeList = response;
        this.overviewProcessTypeOverviewTable = {
          headerValues: [
            { column_identifier: '_id', display_name: 'ID' },
            { column_identifier: 'display_name', display_name: 'Display Name' }
          ],
          rowValues: this.processTypeList
        };
        this.filteredProcessTypeOverviewTable = this.overviewProcessTypeOverviewTable;
      },
      (error: any) => {
        this.router.navigate(['/not-allowed'], { queryParams: { callerMessage: '' } });
      }
    );
  }

  onProcessTypeSelected(id: string) {
    this.selectedProcessTypeId = id;
  }

  onFilterTextChange(event: KeyboardEvent) {
		const filterText = (event.target as HTMLInputElement).value;
		if (this.overviewProcessTypeOverviewTable) {
			this.filteredProcessTypeOverviewTable = this.dataService.filterTableData(
			  this.overviewProcessTypeOverviewTable,
			  filterText
			);
		}
	}
}
