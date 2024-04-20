import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NotificationInterface } from '../../../interfaces/design-interfaces';
import { NotificationComponent } from '../../../components/notification/notification.component';

@Component({
  selector: 'app-operation-request-home',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NotificationComponent
  ],
  templateUrl: './operation-request-home.component.html',
  styleUrl: './operation-request-home.component.scss'
})
export class OperationRequestHomeComponent {
  notifications: NotificationInterface[] = [];
  selectedRequestId: string | undefined;
  requestsDummyDataIds = [
    { _id: '0', display_name: 'Purchase Order Free Text' },
    { _id: '1', display_name: 'Sales Order Creation' },
    { _id: '2', display_name: 'Invoice Processing' },
    { _id: '3', display_name: 'Stock Replenishment' },
    { _id: '4', display_name: 'Debtor Reconciliation' },
    { _id: '5', display_name: 'Financial Closing' },
    { _id: '6', display_name: 'Parts Procurement' },
    { _id: '7', display_name: 'Invoice Verification' },
    { _id: '8', display_name: 'Goods Allocation' },
  ]

  display_name: string = 'Request 1';
  process_type: string = 'Type 1';

  documentInstanceDummyData = {
    _id: '1',
    document_type: 'document_type',
    attributes: {
      name: 'name',
      billing_block: 'billing_block',
      free_text: 'free_text',
    },
    master_data_accessed_fields: ['master_data_accessed_fields'],
    master_data: {
      'master_data': 'master_data'
    },
    _functions: {
      '_functions': '_functions'
    }
  }
  dummyDocForm = this.formBuilder.group({
    attributes: this.formBuilder.group({
      name: '',
      billing_block: '',
      free_text: ''
    }),
    master_data: this.formBuilder.array([
      this.formBuilder.group({
        name: '',
        quatity: ''
      })
    ]),
  });

  requestsDummyData = {
    _id: '1',
    display_name: 'Request 1',
    request_type: 'Type 1',
    request_status: 'Status 1',
    requested_at: '2021-01',
    process_type: 'Process 1',
    options: {
      option_1: 'Approve Purchse Order',
      option_2: 'Send Back to Requester',
    }
  }

  optionsDummyData = ['Approve Purchse Order', 'Send Back to Requester']

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {

  }

  get attributes() { 
    return this.dummyDocForm.get('attributes') as FormGroup;
  }

  onRequestSelected(id: string) {
    this.selectedRequestId = id;
  }

  addNotification(notification: NotificationInterface) {
		this.notifications = [...this.notifications, notification];
	}

	onNotificationDismissed(notification: NotificationInterface) {
		this.notifications = this.notifications.filter(n => n !== notification);
	}

  onSubmit(option: string) {
    this.addNotification({
      message: 'Responded Succesfully',
      type: 'success',
      dismissed: false,
      remainingTime: 5000,
    });
    this.selectedRequestId = undefined;
  }
}
