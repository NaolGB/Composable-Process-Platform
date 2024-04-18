import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DesignApiService } from '../../../design/services/design-api.service';
import { ProcessInstanceInterface } from '../../../interfaces/operation-interfaces';
import { OperationApiService } from '../../services/operation-api.service';

@Component({
  selector: 'app-operation-process-create-new',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './operation-process-create-new.component.html',
  styleUrl: './operation-process-create-new.component.scss'
})
export class OperationProcessCreateNewComponent {
  @Input() processInstanceId: string | undefined;
  processInstance: ProcessInstanceInterface | undefined;

  constructor(
    private designApiService: DesignApiService,
    private operationApiService: OperationApiService
  ) {}

  ngOnInit(): void {
    this.operationApiService.createProcessInstance('process_type').subscribe(
      (response: any) => {
        this.processInstance = response;
      },
      (error: any) => {
        console.log('Error: ', error);
      }
    );
  }
}
