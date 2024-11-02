import { Component, Input } from '@angular/core';
import { OperationApiService } from '../../services/operation-api.service';
import { DesignApiService } from '../../../design/services/design-api.service';
import { CommonModule } from '@angular/common';
import { NotificationInterface, TableDataInterface } from '../../../interfaces/design-interfaces';
import { DataService } from '../../../services/data.service';
import { TableComponent } from '../../../components/table/table.component';
import { OperationProcessCreateNewComponent } from '../operation-process-create-new/operation-process-create-new.component';
import { NotificationComponent } from '../../../components/notification/notification.component';

@Component({
  selector: 'app-operation-process-home',
  standalone: true,
  imports: [
    CommonModule,
    TableComponent,
    NotificationComponent,
    OperationProcessCreateNewComponent
  ],
  templateUrl: './operation-process-home.component.html',
  styleUrl: './operation-process-home.component.scss'
})
export class OperationProcessHomeComponent {
  @Input() notifications: NotificationInterface[] = [];
  processInstanceList: any[] = [];
  processTypeList: any[] = [];
  selectedProcessTypeId: string = '__button_process_type_overview';
  selectedProcessInstanceId: string | undefined;
  selectedWorkingSectionMode: string = '__working_section_overview';

  processInstanceOverviewTable: TableDataInterface | undefined;
  filteredProcessInstanceOverviewTable: TableDataInterface | undefined;

  constructor(
    private operationAiService: OperationApiService,
    private designApiService: DesignApiService,
    private dataService: DataService
  ) {}

  ngOnInit()  {
    this.designApiService.getProcessTypeList().subscribe(
      (response: any) => {
        this.processTypeList = response;
        this.selectedProcessTypeId = this.processTypeList[0]._id;

        if(this.selectedProcessTypeId) {
          this.onProcessTypeSelected(this.selectedProcessTypeId);
        }
      },
      (error: any) => {
        console.log('Error: ', error);
      }
    );
  }

  onProcessTypeSelected(processTypeId: string) {
    this.selectedProcessTypeId = processTypeId;
    console.log('Selected Process Type ID: ', processTypeId);

    this.operationAiService.getProcessInstanceList(processTypeId).subscribe(
      (response: any) => {
        this.processInstanceList = response;
        this.processInstanceOverviewTable = {
          headerValues: [
            {column_identifier: '_id', display_name: 'ID'},
            {column_identifier: 'current_step', display_name: 'Current Step'}
          ],
          rowValues: this.processInstanceList
        };
        this.filteredProcessInstanceOverviewTable = this.processInstanceOverviewTable;
        this.selectedWorkingSectionMode = '__working_section_overview';
      },
      (error: any) => {
        console.log('Error: ', error);
      }
    );
  }
  onCreateNewProcessInstance() {
    this.selectedWorkingSectionMode = '__working_section_create_new_process_instance';

    // this.operationAiService.createProcessInstance(this.selectedProcessTypeId).subscribe(
    //   (response: any) => {
    //     this.selectedProcessInstanceId = response._id;
    //     this.selectedWorkingSectionMode = '__working_section_create_new_process_instance';
    //   },
    //   (error: any) => {
    //     console.log('Error: ', error);
    //   }
    // );
  }

  handleProcessInstanceCreateNewApiResponse(response: any) {
    if (response.success) {
      this.addNotification({
        message: response.message,
        type: 'success',
        dismissed: false,
        remainingTime: 5000
      });
      this.onProcessTypeSelected(this.selectedProcessTypeId);
    }
    else {
      this.addNotification({
        message: response.message,
        type: 'error',
        dismissed: false,
        remainingTime: 5000
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
		if (this.processInstanceOverviewTable) {
			this.filteredProcessInstanceOverviewTable = this.dataService.filterTableData(
			  this.processInstanceOverviewTable,
			  filterText
			);
		}
	}
}
