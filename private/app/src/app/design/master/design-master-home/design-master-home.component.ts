import { ChangeDetectorRef, Component } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { MatTableModule } from '@angular/material/table'; // to enable filtering - see https://material.angular.io/components/table/examples
import { DataService } from '../../../services/data.service';
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import { DesignMasterAddNewComponent } from '../design-master-add-new/design-master-add-new.component';
import { CommonModule } from '@angular/common';
import {MatAccordion, MatExpansionModule} from '@angular/material/expansion';
import { DesignMasterEditComponent } from '../design-master-edit/design-master-edit.component';
import { NotificationComponent } from '../../../components/notification/notification.component';
import { Notification, TableData } from '../../../services/interface';
import { TableComponent } from '../../../components/table/table.component';


@Component({
  selector: 'app-design-master-home',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule, 
    MatDividerModule,
    MatTableModule, 
    MatCardModule, 
    MatGridListModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    DesignMasterAddNewComponent,
    DesignMasterEditComponent,
    NotificationComponent,
    TableComponent,
    MatExpansionModule,
    MatAccordion
  ],
  templateUrl: './design-master-home.component.html',
  styleUrl: './design-master-home.component.scss'
})
export class DesignMasterHomeComponent {
  dbMasterDataOverviewData: any;
  filteredMasterDataOverviewData: any; // to hold the filtered data instead of overwriting the original data with filtered data
  isSidebarOpen = false;
  showSidenavText = false;
  selectedMasterDataId: string = '__select_master_data_overview';
  selectedMasterDataObject: any;
  notifications: Notification[] = [];
  dismissalTime = 5000;

  masterDataOverviewColumnsToDisplay: string[] = ['display_name', '_id'];

  previewTableData: TableData = {} as TableData;
  previewMasterDataOverviewData: {display_name: string, default_value: string}[] = [];
  previewMasterDataOverviewDataColumnsToDisplay: string[] = [];
  previewMasterDataOverviewDataColumns: {}[] = [];

  constructor(
    private apiService: ApiService, 
    private dataService: DataService,
    private cdRef: ChangeDetectorRef
    ) {}

  ngOnInit() {
    this.apiService.getMasterDataOverview().subscribe((data: any) => {
      this.dbMasterDataOverviewData = data['data'];
      this.filteredMasterDataOverviewData = this.dbMasterDataOverviewData;
    });
  }

  selectMasterData(masterDataId: string) {
    this.selectedMasterDataId = masterDataId;
    if (![
          '__select_master_data_overview',
          '__add_new_master_data_type'
        ].includes(this.selectedMasterDataId)) {
      this.apiService.getMasterDataTypeById(masterDataId).subscribe((data: any) => {
        this.selectedMasterDataObject = data['data'];
        this.preparePreviewTable();
      });
    }
    else {
      this.selectedMasterDataObject = null;
      this.previewMasterDataOverviewData = [];
    }
  }

  applyFilter(event: Event) {
    const filterText = (event.target as HTMLInputElement).value;
    this.filteredMasterDataOverviewData = this.dataService.filterData(this.dbMasterDataOverviewData, filterText);
  }

  preparePreviewTable() {
    if (this.selectedMasterDataObject && this.selectedMasterDataObject.attributes) {
      const rowData: {[key: string]: string}[] = [{}]
      const columnsToDisplay: {columnIdentifier: string, displayName: string}[] = [];
  
      // Extract attribute names and default values
      Object.keys(this.selectedMasterDataObject.attributes).forEach(key => {
        const attribute = this.selectedMasterDataObject.attributes[key];
        rowData[0][`display_name_${attribute.display_name}`] = attribute.default_value
        columnsToDisplay.push({
          columnIdentifier: `display_name_${attribute.display_name}`,
          displayName: attribute.display_name
        })
      });

      const newPreviewTableData: TableData = {
        rowContent: rowData,
        columnsToDisplay: columnsToDisplay
      }
      
      this.previewTableData.rowContent = rowData;
      this.previewTableData.columnsToDisplay = columnsToDisplay
      this.previewTableData = newPreviewTableData;
      console.log(this.previewTableData)
    }
  }
  

  handleApiResponse(event: Notification) {
    this.addNotification(event);
  }

  handleTableDataResponse(event: TableData) {
    this.previewTableData = {...event};
    this.cdRef.detectChanges();
    console.log(this.selectedMasterDataId)
    console.log(this.previewTableData)
  }

  addNotification(newNotification: Notification) {
    this.notifications = [...this.notifications, newNotification];
  }

  onNotificaitonDismissed(notification: Notification) {
    this.notifications = this.notifications.filter(n => n !== notification);
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
