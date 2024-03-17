import { Component } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-design-master-home',
  standalone: true,
  imports: [MatListModule, MatDividerModule, MatTableModule, MatCardModule, MatGridListModule],
  templateUrl: './design-master-home.component.html',
  styleUrl: './design-master-home.component.scss'
})
export class DesignMasterHomeComponent {
  dbMasterDataOverviewData: any;
  isSidebarOpen = false;

  masterDataOverviewColumnsToDisplay: string[] = ['display_name', '_id'];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getMasterDataOverview().subscribe((data: any) => {
      this.dbMasterDataOverviewData = data['data'];
      console.log(this.dbMasterDataOverviewData);
    });
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
