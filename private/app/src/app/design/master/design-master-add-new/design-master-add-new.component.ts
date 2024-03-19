import { Component, EventEmitter, Output } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { APIResponse, MasterDataType, Notification } from '../../../services/interface';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'app-design-master-add-new',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    CommonModule,
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

  masterDataFromClient: FormGroup;
  fieldTypeOptions: string[] = ['string', 'number', 'boolean', 'date', 'Master Data Type'];
  previewMasterDataOverviewData: { display_name: any; default_value: any; }[] = [];
  previewMasterDataOverviewDataColumnsToDisplay: string[] = [];

  constructor(private apiService: ApiService, private formBuilder: FormBuilder, private dataService: DataService) { 
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

  addAttribute() {
    const attribute = this.formBuilder.group({
      display_name: ['', Validators.required],
      type: [this.fieldTypeOptions[0], Validators.required],
      is_required: [false, Validators.required],
      default_value: ['', Validators.required]
    });

    this.attributes.push(attribute);
    this.preparePreviewDataFromForm();
  }

  preparePreviewDataFromForm() {
    const formData = this.masterDataFromClient.value;
    const attributes: any[] = formData.attributes; // Assuming 'attributes' is a FormArray
  
    // Transform to the format suitable for preview
    this.previewMasterDataOverviewData = attributes.map(attr => ({
      display_name: attr.display_name,
      default_value: attr.default_value
    }));
    
    this.previewMasterDataOverviewDataColumnsToDisplay = ['display_name', 'default_value'];
  }
  

  removeAttribute(index: number) {
    this.attributes.removeAt(index);
    this.preparePreviewDataFromForm();
  }

  isAPIResponse(object: any): object is APIResponse {
    return Object.keys(object).includes('success') &&
            Object.keys(object).includes('message') &&
           (object.success === true || object.success === false);
  }

  onSubmit() {
    const masterDataFromClientApiFormat: MasterDataType = {
      display_name: this.masterDataFromClient.value.display_name,
      attributes: {}
    }

    console.log(this.dataService.nameToId(this.masterDataFromClient.value.display_name))

    this.attributes.controls.forEach(element => {
      masterDataFromClientApiFormat.attributes[this.dataService.nameToId(element.value.display_name)] = {
        display_name: element.value.display_name,
        type: element.value.type,
        is_required: element.value.is_required,
        default_value: element.value.default_value
      }
    });

    console.log(masterDataFromClientApiFormat);

    this.apiService.createNewMasterDataType(masterDataFromClientApiFormat).subscribe(
      (response: any) => { // Use `any` to allow for type checking within the function
        let notification: Notification;
        if (this.isAPIResponse(response)) {
          console.log('APIResponse');
          // Convert APIResponse to Notification
          notification = {
            type: response.success ? 'success' : 'error', 
            message: response.message || response.success ? 'Success' : 'Failed', // Use API response message or a default one
            dismissed: false,
            remainingTime: 5000
          };
        } else {
          // Response does not fit APIResponse; default to info type Notification
          const fallbackMessage = `Status: ${response.status} ${response.statusText}.`;
          notification = {
            type: 'info',
            message: fallbackMessage,
            dismissed: false,
            remainingTime: 5000
          };
        }
        this.apiResponse.emit(notification);
      },
      (error: any) => {
        // Handle errors by emitting an error type Notification
        const fallbackMessage = `Status: ${error.status} ${error.statusText}.`;
        const notification: Notification = {
          type: 'error',
          message: fallbackMessage ? fallbackMessage : 'An error occurred.',
          dismissed: false,
          remainingTime: 5000
        };
        this.apiResponse.emit(notification);
      })
  }


}
