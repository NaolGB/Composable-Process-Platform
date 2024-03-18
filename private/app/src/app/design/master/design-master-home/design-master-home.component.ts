import { Component } from '@angular/core';
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

@Component({
  selector: 'app-design-master-home',
  standalone: true,
  imports: [
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
    DesignMasterAddNewComponent
  ],
  templateUrl: './design-master-home.component.html',
  styleUrl: './design-master-home.component.scss'
})
export class DesignMasterHomeComponent {
  dbMasterDataOverviewData: any;
  filteredMasterDataOverviewData: any; // to hold the filtered data instead of overwriting the original data with filtered data
  isSidebarOpen = false;
  showSidenavText = false;
  selectedMasterDataId: string = '';
  selectedMasterDataObject: any;

  masterDataOverviewColumnsToDisplay: string[] = ['display_name', '_id'];

  previewMasterDataOverviewData: {}[] = [];
  previewMasterDataOverviewDataColumnsToDisplay: string[] = [];
  previewMasterDataOverviewDataColumns: {}[] = [];

  constructor(private apiService: ApiService, private dataService: DataService) {}

  ngOnInit() {
    this.apiService.getMasterDataOverview().subscribe((data: any) => {
      this.dbMasterDataOverviewData = data['data'];
      this.filteredMasterDataOverviewData = this.dbMasterDataOverviewData;
    });
  }

  selectMasterData(masterDataId: string) {
    this.selectedMasterDataId = masterDataId;
    this.apiService.getMasterDataTypeById(masterDataId).subscribe((data: any) => {
      this.selectedMasterDataObject = data['data'];
      this.getPreviewMasterDataOverviewData();
      this.getpreviewMasterDataOverviewDataColumns(); 
      this.getPreviewMasterDataOverviewDataColumnsToDisplay();
    });
  }

  getPreviewMasterDataOverviewData() {
    if (this.selectedMasterDataObject) {
      this.previewMasterDataOverviewData = [];
      Object.keys(this.selectedMasterDataObject['attributes']).forEach((item: string) => {
        const displayName = this.selectedMasterDataObject['attributes'][item].display_name;
        const defaultValue = this.selectedMasterDataObject['attributes'][item].default_value;
        const previewItem = {
          [displayName]: defaultValue,
        };
        this.previewMasterDataOverviewData.push(previewItem);
      });

      console.log(this.previewMasterDataOverviewData);
    }
  }

  getpreviewMasterDataOverviewDataColumns() {
    if (this.selectedMasterDataObject) {
      this.previewMasterDataOverviewDataColumns = [];
      Object.keys(this.selectedMasterDataObject['attributes']).forEach((item: string) => {
        const displayName = this.selectedMasterDataObject['attributes'][item].display_name;
        const defaultValue = this.selectedMasterDataObject['attributes'][item].default_value;
        const previewItem = {
          columnDef: displayName,
          header: displayName,
          cell: defaultValue
        };
        this.previewMasterDataOverviewDataColumns.push(previewItem);
      });

      console.log(this.previewMasterDataOverviewDataColumns);
    }
  }

  getPreviewMasterDataOverviewDataColumnsToDisplay() {
    if (this.selectedMasterDataObject) {
      this.previewMasterDataOverviewDataColumnsToDisplay = this.previewMasterDataOverviewDataColumns.map((item: any) => item.columnDef);
      console.log(this.previewMasterDataOverviewDataColumnsToDisplay);
    }
  }

  applyFilter(event: Event) {
    const filterText = (event.target as HTMLInputElement).value;
    this.filteredMasterDataOverviewData = this.dataService.filterData(this.dbMasterDataOverviewData, filterText);
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
