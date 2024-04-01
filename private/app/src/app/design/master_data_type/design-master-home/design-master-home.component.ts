import { Component } from '@angular/core';
import { DesignApiService } from '../../services/design-api.service';
import { CommonModule } from '@angular/common';
import { ApiResponsePackageInterface, MasterDataTypeInterface, TableDataInterface } from '../../../interfaces/design-interfaces';
import { TableComponent } from '../../../components/table/table.component';
import { DataService } from '../../../services/data.service';
import { Event } from '@angular/router';
import { DesignMasterAddNewComponent } from '../design-master-add-new/design-master-add-new.component';

@Component({
  selector: 'app-design-master-home',
  standalone: true,
  imports: [
	CommonModule,
	TableComponent,
	DesignMasterAddNewComponent
  ],
  templateUrl: './design-master-home.component.html',
  styleUrl: './design-master-home.component.scss'
})
export class DesignMasterHomeComponent {
	masterDataTypeList: any[] = [];
	// selectedMasterDataTypeId: string = '__button_master_data_type_overview';
	selectedMasterDataTypeId: string = '__button_master_data_type_add_new';
	selectedMasterDataTypeObject: MasterDataTypeInterface | undefined;

	overviewMasterDataOverviewTable: TableDataInterface | undefined;
	filteredOverviewMasterDataOverviewTable: TableDataInterface | undefined;

	constructor(private apiService: DesignApiService, private dataService: DataService) { }

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
				console.log(error);
			}
		);
	}

	onMasterDataTypeSelected(id: string) {
		this.selectedMasterDataTypeId = id;
		if (['__button_master_data_type_overview', '__button_master_data_type_add_new'].includes(id)) {
			this.selectedMasterDataTypeObject = undefined;
		} else {
			this.apiService.getMasterDataType(id).subscribe(
				(response: any) => {
					this.selectedMasterDataTypeObject = response;
				}
			);
		}
	}

	handleMasterDataTypeAddNewApiResponse(response: ApiResponsePackageInterface) {
		if (response.success) {
			if (response.data) {
				this.masterDataTypeList.push(response.data);
			}
		}
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
