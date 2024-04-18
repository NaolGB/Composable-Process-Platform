import { Component, Input } from '@angular/core';
import { DesignApiService } from '../../services/design-api.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TableComponent } from '../../../components/table/table.component';
import { NotificationInterface, TableDataInterface } from '../../../interfaces/design-interfaces';
import { DataService } from '../../../services/data.service';
import { GraphsProcessFlowComponent } from '../../../components/graphs-process-flow/graphs-process-flow.component';

@Component({
  selector: 'app-design-process-home',
  standalone: true,
  imports: [
    CommonModule,
    TableComponent,
  ],
  templateUrl: './design-process-home.component.html',
  styleUrl: './design-process-home.component.scss'
})
export class DesignProcessHomeComponent {
  notifications: NotificationInterface[] = [];
  
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
    if (id === '__button_process_type_add_new') {
      this.router.navigate(['/design/process-type/add-new']);
    }
  }

  addNotification(notification: NotificationInterface) {
		this.notifications = [...this.notifications, notification];
	}

	onNotificationDismissed(notification: NotificationInterface) {
		this.notifications = this.notifications.filter(n => n !== notification);
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
