import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiResponsePackageInterface, MasterDataTypeInterface } from '../../../interfaces/design-interfaces';
import { DataService } from '../../../services/data.service';
import { DesignApiService } from '../../services/design-api.service';

@Component({
  selector: 'app-design-master-add-new',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './design-master-add-new.component.html',
  styleUrl: './design-master-add-new.component.scss'
})
export class DesignMasterAddNewComponent {
  @Output() apiResposnse: EventEmitter<ApiResponsePackageInterface> = new EventEmitter();
	masterDataTypeList: any[] = [];
  masterDataTypeForm: FormGroup;
  masterDataAttributeTypeOptions: string[] = ['Text', 'Number', 'Boolean', 'Date', 'Master Data Type'];
  
  constructor(private formBuilder: FormBuilder, private dataService: DataService, private apiService: DesignApiService) {
    this.masterDataTypeForm = this.formBuilder.group({
      display_name: ['', Validators.required],
      attributes: this.formBuilder.array([
        this.formBuilder.group({
          display_name: ['', Validators.required],
          type: [this.masterDataAttributeTypeOptions[0], Validators.required],
          is_required: [false, Validators.required],
          default_value: ['', Validators.required]
        }),
      ])
    });
  }

  ngOnInit() {
		this.apiService.getMasterDataTypeList().subscribe(
			(resposne: any) => {
				this.masterDataTypeList = resposne;
			},
			(error: any) => {
				console.log(error);
			}
		);
	}

  get attributes() {
    return this.masterDataTypeForm.get('attributes') as FormArray;
  }

  get displayName()  {
    return this.masterDataTypeForm.get('display_name')?.value;
  }

  addAttribute() {
    const attribute = this.formBuilder.group({
      display_name: ['', Validators.required],
      type: [this.masterDataAttributeTypeOptions[0], Validators.required],
      is_required: [false, Validators.required],
      default_value: ['', Validators.required]
    });

    this.attributes.push(attribute);
  }

  removeAttribute(index: number) {
    this.attributes.removeAt(index);
  }

  onSubmit() {
    const masterDataType: MasterDataTypeInterface = {
      display_name: this.masterDataTypeForm.value.display_name,
      attributes: {}
    };

    this.attributes.controls.forEach((control, index) => {
      const attribute = control.value;
      masterDataType.attributes[this.dataService.nameToId(attribute.display_name)] = {
        display_name: attribute.display_name,
        type: attribute.type,
        is_required: attribute.is_required,
        default_value: attribute.default_value
      };
    });

    this.apiService.postMasterDataType(masterDataType).subscribe( 
      (response: any) => {
          const apiResponsePackage: ApiResponsePackageInterface = {
            success: true,
            message: 'Master Data Type Added Successfully',
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
