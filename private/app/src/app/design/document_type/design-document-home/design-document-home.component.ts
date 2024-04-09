import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { DesignApiService } from '../../services/design-api.service';
import { ApiResponsePackageInterface, NotificationInterface, TableDataInterface } from '../../../interfaces/design-interfaces';
import { Router } from '@angular/router';
import { TableComponent } from '../../../components/table/table.component';
import { DataService } from '../../../services/data.service';
import { DesignDocumentAddNewComponent } from '../design-document-add-new/design-document-add-new.component';

@Component({
  selector: 'app-design-document-home',
  standalone: true,
  imports: [
    CommonModule,
	TableComponent,
	DesignDocumentAddNewComponent
  ],
  templateUrl: './design-document-home.component.html',
  styleUrl: './design-document-home.component.scss'
})
export class DesignDocumentHomeComponent {
	
	documentTypeList: any[] = [];
	selectedDocumentTypeId: string = '__button_document_type_overview';
	notifications: NotificationInterface[] = [];

	overviewDocumentTypeOverviewTable: TableDataInterface | undefined;
	filteredOverviewDocumentTypeOverviewTable: TableDataInterface | undefined;

	constructor(
		private apiService: DesignApiService,
		private dataService: DataService,
		private router: Router
	) {}

	ngOnInit() {
		this.apiService.getDocumentTypeList().subscribe(
			(resposne: any) => {
				this.documentTypeList = resposne;
				this.overviewDocumentTypeOverviewTable = {
					headerValues: [
						{column_identifier: '_id', display_name: 'ID'},
						{column_identifier: 'display_name', display_name: 'Display Name'}
					],
					rowValues: this.documentTypeList
				};
				this.filteredOverviewDocumentTypeOverviewTable = this.overviewDocumentTypeOverviewTable;
			},
			(error: any) => {
				this.router.navigate(['/not-allowed'], {queryParams: {callerMessage: ''}});
			}
		);
	}

	onDocumentTypeSelected(id: string) {
		this.selectedDocumentTypeId = id;
	}

	handleDocumentTypeApiResponse(response: ApiResponsePackageInterface) {
		
	}

	onFilterTextChange(event: KeyboardEvent) {
		const filterText = (event.target as HTMLInputElement).value;
		if (this.overviewDocumentTypeOverviewTable) {
			this.filteredOverviewDocumentTypeOverviewTable = this.dataService.filterTableData(
			  this.overviewDocumentTypeOverviewTable,
			  filterText
			);
		}
	}
}
