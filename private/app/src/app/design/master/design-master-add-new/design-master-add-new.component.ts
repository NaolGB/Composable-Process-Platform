import { Component, EventEmitter, Output } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { APIResponse, MasterDataType, Notification, TableData } from '../../../services/interface';
import { DataService } from '../../../services/data.service';
import { DesignMasterGeneralService } from '../services/design-master-general.service';
import { TileComponent } from '../../../components/tile/tile.component';

@Component({
  selector: 'app-design-master-add-new',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    CommonModule,
    TileComponent,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule
  ],
  templateUrl: './design-master-add-new.component.html',
  styleUrl: './design-master-add-new.component.scss'
})
export class DesignMasterAddNewComponent {
  @Output() apiResponse: EventEmitter<Notification> = new EventEmitter<Notification>();
  @Output() tableDataEmitter: EventEmitter<TableData> = new EventEmitter<TableData>();

  masterDataFromClient: FormGroup;
  fieldTypeOptions: string[] = ['string', 'number', 'boolean', 'date', 'Master Data Type'];
  previewMasterDataOverviewData: { display_name: any; default_value: any; }[] = [];
  previewMasterDataOverviewDataColumnsToDisplay: string[] = [];

  constructor(
    private apiService: ApiService, 
    private formBuilder: FormBuilder, 
    private dataService: DataService,
    private designMasterGeneralService: DesignMasterGeneralService
  ) { 
    this.masterDataFromClient = this.formBuilder.group({
      display_name: ['', Validators.required],	
      attributes: this.formBuilder.array([
        this.formBuilder.group({
          display_name: ['', Validators.required],
          type: [this.fieldTypeOptions[0], Validators.required],
          is_required: [true, Validators.required],
          default_value: ['', Validators.required]
        })
      ])
    });
  }

  get attributes() {
    return this.masterDataFromClient.get('attributes') as FormArray;
  }

  toggleCheckbox(attribute: AbstractControl) {
    attribute.get('is_required')?.setValue(!attribute.value.is_required);
  }

  addAttribute() {
    const attribute = this.formBuilder.group({
      display_name: ['', Validators.required],
      type: [this.fieldTypeOptions[0], Validators.required],
      is_required: [false, Validators.required],
      default_value: ['', Validators.required]
    });

    this.attributes.push(attribute);
    this.prepareAndEmitPreviewData();
  }

  prepareAndEmitPreviewData() {
    const attributes = this.masterDataFromClient.get('attributes') as FormArray;
    const tableData = this.designMasterGeneralService.prepareAttributePreviewDataForTableFromFormArray(attributes);
    this.tableDataEmitter.emit(tableData); 
  }
  

  removeAttribute(index: number) {
    this.attributes.removeAt(index);
    this.prepareAndEmitPreviewData();
  }

  onSubmit() {
    const masterDataFromClientApiFormat: MasterDataType = {
      display_name: this.masterDataFromClient.value.display_name,
      attributes: {}
    }

    this.attributes.controls.forEach(element => {
      masterDataFromClientApiFormat.attributes[this.dataService.nameToId(element.value.display_name)] = {
        display_name: element.value.display_name,
        type: element.value.type,
        is_required: element.value.is_required,
        default_value: element.value.default_value
      }
    });

    this.apiService.createNewMasterDataType(masterDataFromClientApiFormat).subscribe(
      (response: any) => { // Use `any` to allow for type checking within the function
        const notification = this.designMasterGeneralService.createNotificationFromAPIResponse(response);
        this.apiResponse.emit(notification);
      },
      (error: any) => {
        const notification = this.designMasterGeneralService.createNotificationFromAPIResponse(error);
        this.apiResponse.emit(notification);
      })
  }


}
