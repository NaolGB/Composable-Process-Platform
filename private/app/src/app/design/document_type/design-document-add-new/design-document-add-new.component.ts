import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService } from '../../../services/data.service';
import { DesignApiService } from '../../services/design-api.service';
import { ApiResponsePackageInterface, DocumentTypeInterface } from '../../../interfaces/design-interfaces';

@Component({
  selector: 'app-design-document-add-new',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './design-document-add-new.component.html',
  styleUrl: './design-document-add-new.component.scss'
})
export class DesignDocumentAddNewComponent {
  @Output() apiResposnse: EventEmitter<ApiResponsePackageInterface> = new EventEmitter();
  masterDataTypeList: any[] = [];
  documentTypeForm: FormGroup;
  documentAttributeTypeOptions: string[] = ['Text', 'Number', 'Boolean', 'Date', 'Master Data Type'];

  constructor(private formBuilder: FormBuilder, private dataService: DataService, private apiService: DesignApiService) {
    this.documentTypeForm = this.formBuilder.group({
      display_name: ['', dataService.generalFormInputValidator()],
      attributes: this.formBuilder.array([
        this.formBuilder.group({
          display_name: ['', dataService.generalFormInputValidator()],
          type: [this.documentAttributeTypeOptions[0], dataService.generalFormInputValidator()],
          is_required: [false, Validators.required],
          default_value: ['', dataService.generalFormInputValidator()]
        }),
      ])
    });
  }

  ngOnInit(): void {
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
    return this.documentTypeForm.get('attributes') as FormArray;
  }

  get displayName()  {
    return this.documentTypeForm.get('display_name')?.value;
  }

  addAttribute() {
    const attribute = this.formBuilder.group({
      display_name: ['', this.dataService.generalFormInputValidator()],
      type: [this.documentAttributeTypeOptions[0], this.dataService.generalFormInputValidator()],
      is_required: [false, Validators.required],
      default_value: ['', this.dataService.generalFormInputValidator()]
    });
    this.attributes.push(attribute);
  }

  removeAttribute(index: number) {
    this.attributes.removeAt(index);
  }

  onSubmit() {
    if (this.documentTypeForm.invalid) {
      const apiResponsePackage: ApiResponsePackageInterface = {
        success: false,
        message: 'Input invalid\n- All fields are required\n- All fields need a minimum of 1 character and a maximum of 64\n- Reserved keywords are not allowed',
      };
    };

    const documentType: DocumentTypeInterface = {
      display_name: this.documentTypeForm.value.display_name,
      attributes: {}
    };

    this.attributes.controls.forEach((control, index) => {
      const attribute = control.value;
      documentType.attributes[this.dataService.nameToId(attribute.display_name)] = {
        display_name: attribute.display_name,
        type: attribute.type,
        is_required: attribute.is_required,
        default_value: attribute.default_value
      };
    });

    console.log(documentType);

  }
}
