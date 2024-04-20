import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DesignApiService } from '../../../design/services/design-api.service';
import { ProcessInstanceInterface } from '../../../interfaces/operation-interfaces';
import { OperationApiService } from '../../services/operation-api.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiResponsePackageInterface } from '../../../interfaces/design-interfaces';

@Component({
  selector: 'app-operation-process-create-new',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './operation-process-create-new.component.html',
  styleUrl: './operation-process-create-new.component.scss'
})
export class OperationProcessCreateNewComponent {
  @Output() apiResposnse: EventEmitter<ApiResponsePackageInterface> = new EventEmitter();
  @Input() processInstanceId: string | undefined;
  processInstance: ProcessInstanceInterface | undefined;

  processInstanceDummyData: ProcessInstanceInterface = {
    _id: '1',
    process_type: {
      _id: '1',
      display_name: 'display_name'
    },
    document_intances: ['1'],
    current_step: 'start',
    status: 'status',
    created_at: '00:00:00',
    updated_at: '00:01:00',
  }

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

  constructor(private formBuilder: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    // this.operationApiService.createProcessInstance('process_type').subscribe(
    //   (response: any) => {
    //     this.processInstance = response;
    //   },
    //   (error: any) => {
    //     console.log('Error: ', error);
    //   }
    // );
  }

  get attributes() {
    return this.dummyDocForm.get('attributes') as FormGroup;
  }

  onSubmit(option: string) {
    this.apiResposnse.emit({
      success: true,
      message: 'Process Instance Created'
    });
  }
}
