import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-operation-request-home',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './operation-request-home.component.html',
  styleUrl: './operation-request-home.component.scss'
})
export class OperationRequestHomeComponent {
  selectedRequestId: string | undefined;
  requestsDummyDataIds = [
    { _id: '1', display_name: 'Request 1' },
    { _id: '2', display_name: 'Request 2' },
    { _id: '3', display_name: 'Request 3' },
    { _id: '4', display_name: 'Request 4' },
    { _id: '5', display_name: 'Request 5' },
    { _id: '6', display_name: 'Request 6' },
    { _id: '7', display_name: 'Request 7' },
    { _id: '8', display_name: 'Request 8' },
    { _id: '9', display_name: 'Request 9' },
    { _id: '10', display_name: 'Request 10' }
  ]

  requestsDummyData = {
    _id: '1',
    display_name: 'Request 1',
    request_type: 'Type 1',
    request_status: 'Status 1',
    requested_at: '2021-01',
    process_type: 'Process 1',
  }

  constructor() { }

  ngOnInit(): void {

  }

  onRequestSelected(id: string) {
    this.selectedRequestId = id;
  }
}
