import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TableDataInterface } from '../../interfaces/design-interfaces';
import { TableComponent } from '../../components/table/table.component';

@Component({
  selector: 'app-analytics-home',
  standalone: true,
  imports: [
    CommonModule,
    TableComponent
  ],
  templateUrl: './analytics-home.component.html',
  styleUrl: './analytics-home.component.scss'
})
export class AnalyticsHomeComponent {
  // selectedProcessTypeId: string = '__button_process_type_overview';
  selectedProcessTypeId: string = '1';
  selectedAnalyticsMode: string = '__analytics_drilldown';

  eventTableData: TableDataInterface | undefined;
  filteredEventTableData: TableDataInterface | undefined;

  processTypeList = [
    { _id: '0', display_name: 'Order Management' },
    { _id: '1', display_name: 'Procurement' },
    { _id: '2', display_name: 'Accounts Payable' },
    { _id: '3', display_name: 'Inventory Management' },
    { _id: '4', display_name: 'Accounts Receivable' },
    { _id: '5', display_name: 'General Ledger' },
    { _id: '6', display_name: 'Spare Parts Management' },
    { _id: '7', display_name: 'Invoice Allocation' },
    { _id: '8', display_name: 'Warehouse Management' },
    { _id: '9', display_name: 'Warranty Management' },
    { _id: '10', display_name: 'Hire to Retire' },
    { _id: '11', display_name: 'Onboarding' },
    { _id: '12', display_name: 'Opportunity to Order' },
    { _id: '13', display_name: 'Lead to Cash' },
    { _id: '14', display_name: 'Procurement' },
    { _id: '15', display_name: 'Quality Management' },
    { _id: '16', display_name: 'Production Planning' },
    { _id: '17', display_name: 'Maintenance Management' },
    { _id: '18', display_name: 'Product Lifecycle Management' },
    { _id: '19', display_name: 'Customer Service Management' },
    { _id: '20', display_name: 'Compliance Management' },
    { _id: '21', display_name: 'Risk Management' },
    { _id: '22', display_name: 'IT Service Management' },
    { _id: '23', display_name: 'Supply Chain Management' },
    { _id: '24', display_name: 'Change Management' }
  ]

  eventDummyData = [
    { _id: '1', process_instance: '1', display_name: 'Event 1', event_type: 'Automated', started_at: '2021-01-01T00:00:00Z', ended_at: '2021-01-01T00:00:00Z', status: 'Completed' },
  ]

  ngOnInit() {
    this.eventTableData = {
      headerValues: [
        { column_identifier: '_id', display_name: 'ID' },
        { column_identifier: 'process_instance', display_name: 'Process Instance' },
        { column_identifier: 'display_name', display_name: 'Display Name' },
        { column_identifier: 'event_type', display_name: 'Event Type' },
        { column_identifier: 'started_at', display_name: 'Started At' },
        { column_identifier: 'ended_at', display_name: 'Ended At' },
        { column_identifier: 'status', display_name: 'Status' }
      ],
      rowValues: this.eventDummyData
    };

    this.filteredEventTableData = this.eventTableData;
  }

  onProcessTypeSelected(processTypeId: string) {
    this.selectedProcessTypeId = processTypeId;
  }

  onSelectAnalyticsMode(analyticsMode: string) {
    this.selectedAnalyticsMode = analyticsMode;
  }
}
