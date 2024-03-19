import { Component, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { APIResponse, MasterDataType } from '../../../services/interface';
import { ApiService } from '../../../services/api.service';
import { CommonModule } from '@angular/common';
import { OnChanges, SimpleChanges } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'app-design-master-edit',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatGridListModule,
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule
  ],
  templateUrl: './design-master-edit.component.html',
  styleUrl: './design-master-edit.component.scss'
})
export class DesignMasterEditComponent {
  @Input() masterDataId: string | undefined;
  // @Output() apiResponse: EventEmitter<any> = new EventEmitter<any>();

  masterDataObject: MasterDataType | undefined;
  masterDataFromClient: FormGroup;
  fieldTypeOptions: string[] = ['string', 'number', 'boolean', 'date', 'Master Data Type'];


  constructor(private apiService: ApiService, private formBuilder: FormBuilder, private dataService: DataService) {
    this.masterDataFromClient = this.formBuilder.group({
      display_name: ['', Validators.required],
      attributes: this.formBuilder.array([])
    });
  }

  ngOnChanges(changes: SimpleChanges) { 
    // This is a lifecycle hook that is called when any data-bound property of the directive changes.
    // Using ngOnChanges instead of ngOnInit because we want to fetch data every time the masterDataId changes
    if (changes['masterDataId'] && changes['masterDataId'].currentValue !== changes['masterDataId'].previousValue) {
      this.fetchData();
    }
  }

  get attributes() {
    return this.masterDataFromClient.get('attributes') as FormArray;
  }
  

  private fetchData() {
    this.apiService.getMasterDataTypeById(this.masterDataId ?? '').subscribe((data: any) => {
      this.masterDataObject = data['data'];
      console.log(this.masterDataObject);
      if (!this.masterDataObject) {
        return;
      }
      this.masterDataFromClient.patchValue({
        display_name: this.masterDataObject.display_name
      });
  
      // Clear existing attributes
      this.attributes.clear();
  
      // Add attributes to the form
      for (const attributeId in this.masterDataObject.attributes) {
        const attribute = this.masterDataObject.attributes[attributeId];
        this.attributes.push(this.formBuilder.group({
          id: [attributeId], // Add the existing attribute ID
          display_name: [attribute.display_name, Validators.required],
          type: [{value: attribute.type, disabled: true}, Validators.required], // Set the disabled property
          is_required: [attribute.is_required],
          default_value: [attribute.default_value, Validators.required],
          isNew: [false]
        }));
      }
    });
  }

  addAttribute() {
    const attribute = this.formBuilder.group({
      display_name: ['', Validators.required],
      type: [{value: this.fieldTypeOptions[0], disabled: false}, Validators.required], // Set the disabled property
      is_required: [false],
      default_value: ['', Validators.required],
      isNew: [true]
    });
  
    this.attributes.push(attribute);
  }

  onSubmit() {
    if (this.masterDataFromClient.pristine) {
      return; // Exit the method if the form is pristine (no changes)
    }
    
    const masterDataFromClientApiFormat: MasterDataType = {
      display_name: this.masterDataFromClient.value.display_name,
      attributes: {}
    };
  
    this.attributes.controls.forEach(element => {
      const attributeId = element.get('isNew')?.value
        ? this.dataService.nameToId(element.value.display_name)
        : element.value.id; // Use the existing attribute ID for non-new attributes
  
      masterDataFromClientApiFormat.attributes[attributeId] = {
        display_name: element.value.display_name,
        type: element.get('type')?.value || '', // Get the type value using the form control
        is_required: element.get('is_required')?.value || false, // Get the is_required value using the form control
        default_value: element.value.default_value
      };
    });
  
    console.log(masterDataFromClientApiFormat);
  
    this.apiService.updateMasterDataType(this.masterDataId ?? '', masterDataFromClientApiFormat).subscribe(
      (response: any) => {
        // this.apiResponse.emit(response);
      },
      (error: any) => {
        // this.apiResponse.emit(error);
      });
  }
}
