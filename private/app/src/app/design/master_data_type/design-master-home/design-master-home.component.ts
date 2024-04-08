import { Component } from '@angular/core';
import { DesignApiService } from '../../services/design-api.service';
import { CommonModule } from '@angular/common';
import { ApiResponsePackageInterface, MasterDataTypeInterface, NotificationInterface, TableDataInterface } from '../../../interfaces/design-interfaces';
import { TableComponent } from '../../../components/table/table.component';
import { DataService } from '../../../services/data.service';
import { DesignMasterAddNewComponent } from '../design-master-add-new/design-master-add-new.component';
import { NotificationComponent } from '../../../components/notification/notification.component';
import { DesignMasterUpdateComponent } from '../design-master-update/design-master-update.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-design-master-home',
  standalone: true,
  imports: [
	CommonModule,
	TableComponent,
	NotificationComponent,
	DesignMasterAddNewComponent,
	DesignMasterUpdateComponent,
  ],
  templateUrl: './design-master-home.component.html',
  styleUrl: './design-master-home.component.scss'
})
export class DesignMasterHomeComponent {
	masterDataTypeList: any[] = [];
	selectedMasterDataTypeId: string = '__button_master_data_type_overview';
	notifications: NotificationInterface[] = [];

	overviewMasterDataOverviewTable: TableDataInterface | undefined;
	filteredOverviewMasterDataOverviewTable: TableDataInterface | undefined;

	constructor(
		private apiService: DesignApiService, 
		private dataService: DataService, private router: Router
	) {}

	ngOnInit() {
		this.apiService.getMasterDataTypeList().subscribe(
			(resposne: any) => {
				this.masterDataTypeList = resposne;
				this.overviewMasterDataOverviewTable = {
					headerValues: [
						{column_identifier: '_id', display_name: 'ID'},
						{column_identifier: 'display_name', display_name: 'Display Name'}
					],
					rowValues: this.masterDataTypeList
				};
				this.filteredOverviewMasterDataOverviewTable = this.overviewMasterDataOverviewTable;
			},
			(error: any) => {
				if(error.status === 401) {
					this.router.navigate(['/not-allowed'], {queryParams: {callerMessage: '401_error'}});
				}
				else {
					this.router.navigate(['/not-allowed'], {queryParams: {callerMessage: 'error'}});
				}
			}
		);
	}

	onMasterDataTypeSelected(id: string) {
		this.selectedMasterDataTypeId = id;
	}

	handleMasterDataTypeApiResponse(response: ApiResponsePackageInterface) {
		if (response.success) {
			if (response.data) {
				this.masterDataTypeList.push(response.data);
			}
			this.addNotification({
				message: response.message,
				type: 'success',
				dismissed: false,
				remainingTime: 5000,
			});
			this.onMasterDataTypeSelected('__button_master_data_type_overview');
		}
		else {
			this.addNotification({
				message: response.message,
				type: 'error',
				dismissed: false,
				remainingTime: 5000,
			});
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
		if (this.overviewMasterDataOverviewTable) {
			this.filteredOverviewMasterDataOverviewTable = this.dataService.filterTableData(
			  this.overviewMasterDataOverviewTable,
			  filterText
			);
		}
	  }
}
