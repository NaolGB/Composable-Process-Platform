import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { DesignApiService } from '../../services/design-api.service';
import { ApiResponsePackageInterface, MasterDataTypeInterface } from '../../../interfaces/design-interfaces';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'app-design-master-update',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './design-master-update.component.html',
  styleUrl: './design-master-update.component.scss'
})
export class DesignMasterUpdateComponent {
  @Input() selectedMasterDataTypeId: string | undefined;
  @Output() apiResposnse: EventEmitter<ApiResponsePackageInterface> = new EventEmitter();
	selectedMasterDataTypeObject: MasterDataTypeInterface | undefined;
  masterDataTypeForm: FormGroup;
	masterDataTypeList: any[] = [];
  masterDataAttributeTypeOptions: string[] = ['Text', 'Number', 'Boolean', 'Date', 'Master Data Type'];

  constructor(private apiService: DesignApiService, private formBuilder: FormBuilder, private dataService: DataService) {
    this.masterDataTypeForm = this.formBuilder.group({
      display_name: ['', this.dataService.generalFormInputValidator()],
      attributes: this.formBuilder.array([])
    });
  }

  ngOnInit(): void {
    this.apiService.getMasterDataTypeList().subscribe(
			(resposne: any) => {
				this.masterDataTypeList = resposne;
			}
		);
  }

  ngOnChanges(changes: SimpleChanges) { 
    if (changes['selectedMasterDataTypeId'] && changes['selectedMasterDataTypeId'].currentValue !== changes['selectedMasterDataTypeId'].previousValue) {
      this.fetchData();
    }
  }

  private fetchData() {
    this.apiService.getMasterDataType(this.selectedMasterDataTypeId ?? '').subscribe((response: any) => {
      this.selectedMasterDataTypeObject = response;
      if (!this.selectedMasterDataTypeObject || !this.masterDataTypeForm) {
        return;
      }
      this.masterDataTypeForm.patchValue({
        display_name: this.selectedMasterDataTypeObject.display_name
      });

      // Clear existing attributes
      this.attributes.clear();

      // Add attributes to the form
      for (const attributeId in this.selectedMasterDataTypeObject.attributes) {
        const attribute = this.selectedMasterDataTypeObject.attributes[attributeId];
        this.attributes.push(this.formBuilder.group({
          id: [attributeId],
          display_name: [attribute.display_name, Validators.required],
          type: [attribute.type, Validators.required], 
          is_required: [attribute.is_required],
          default_value: [attribute.default_value, Validators.required],
          isNew: [false]
        }));
      }
    });
  }

  get attributes() {
    return this.masterDataTypeForm.get('attributes') as FormArray;
  }

  get displayName()  {
    if (!this.masterDataTypeForm) {
      return '';
    }
    return this.masterDataTypeForm.get('display_name')?.value;
  }

  addAttribute() {
    const attribute = this.formBuilder.group({
      display_name: ['', this.dataService.generalFormInputValidator()],
      type: [this.masterDataAttributeTypeOptions[0], this.dataService.generalFormInputValidator()],
      is_required: [false, Validators.required],
      default_value: ['', this.dataService.generalFormInputValidator()],
      isNew: [true]
    });

    this.attributes.push(attribute);
  }

  removeAttribute(index: number) {
    this.attributes.removeAt(index);
  }

  onSubmit() {
    if (this.masterDataTypeForm.invalid) {
      const apiResponsePackage: ApiResponsePackageInterface = {
        success: false,
        message: 'Input invalid\n- All fields are required\n- All fields need a minimum of 1 character and a maximum of 64\n- Reserved keywords are not allowed',
      };
      this.apiResposnse.emit(apiResponsePackage);
      return;
    }

    if (this.masterDataTypeForm.pristine) {
      return; // Exit the method if the form is pristine (no changes)
    }

    const masterDataType: MasterDataTypeInterface = {
      display_name: this.masterDataTypeForm.value.display_name,
      attributes: {}
    };

    this.attributes.controls.forEach((control, index) => {
      const attribute = control.value;
      const attributeId = attribute.isNew
        ? this.dataService.nameToId(attribute.display_name)
        : attribute.id; // Use the existing attribute ID for non-new attributes

      masterDataType.attributes[attributeId] = {
        display_name: attribute.display_name,
        type: attribute.type,
        is_required: attribute.is_required || false, // Use the default value if the value is undefined
        default_value: attribute.default_value
      };
    });

    this.apiService.putMasterDataType(masterDataType, this.selectedMasterDataTypeId ?? '').subscribe(
      (response: any) => {
        const apiResponsePackage: ApiResponsePackageInterface = {
          success: true,
          message: 'Master Data Type Updated Successfully',
          data: response
        };
        this.apiResposnse.emit(apiResponsePackage);
    },
    (error: any) => {
      const apiResponsePackage: ApiResponsePackageInterface = {
        success: false,
        message: error.message || 'An error occurred',
      };
      this.apiResposnse.emit(apiResponsePackage);
    }
    );
  }
}
