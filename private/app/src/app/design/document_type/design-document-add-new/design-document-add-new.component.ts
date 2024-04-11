import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService } from '../../../services/data.service';
import { DesignApiService } from '../../services/design-api.service';
import { ApiResponsePackageInterface, CheckboxDataInterface, DocumentTypeInterface } from '../../../interfaces/design-interfaces';
import { OverlaySidebarCheckboxComponent } from '../../../components/overlay-sidebar-checkbox/overlay-sidebar-checkbox.component';

@Component({
  selector: 'app-design-document-add-new',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    OverlaySidebarCheckboxComponent
  ],
  templateUrl: './design-document-add-new.component.html',
  styleUrl: './design-document-add-new.component.scss'
})
export class DesignDocumentAddNewComponent {
  @Output() apiResposnse: EventEmitter<ApiResponsePackageInterface> = new EventEmitter();
  masterDataTypeList: any[] = [];
  masterDataTypeId: string | undefined;
  documentTypeForm: FormGroup;
  selectedTab: string = 'attribute';

  documentAttributeTypeOptions: string[] = ['Text', 'Number', 'Boolean', 'Date'];

  showSidebar = false;
  masterDataTypeAttributesAsCheckboxData: CheckboxDataInterface[] = [];

  constructor(private formBuilder: FormBuilder, private dataService: DataService, private apiService: DesignApiService) {
    this.documentTypeForm = this.formBuilder.group({
      display_name: ['', dataService.generalFormInputValidator()],
      master_data_type: this.formBuilder.group({
        id: ['', Validators.required],
        fields_to_update: this.formBuilder.array([]),
        fields_to_display: this.formBuilder.array([]),
      }),
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
        this.masterDataTypeId = this.masterDataTypeList[0]._id;
			}
		);
  }

  get attributes() {
    return this.documentTypeForm.get('attributes') as FormArray;
  }

  get displayName()  {
    return this.documentTypeForm.get('display_name')?.value;
  }

  onSelectedTab(tab: string) {
    this.selectedTab = tab;
  }

  onSelectMasterDataType(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.masterDataTypeId = target.value;
    
    const checkboxData: CheckboxDataInterface[] = [];
    if (this.masterDataTypeId) {
      this.apiService.getMasterDataType(this.masterDataTypeId).subscribe(
        (response: any) => {
          Object.keys(response.attributes).forEach(element => {
            console.log(element);
            const display_name = response.attributes[element].display_name;
            checkboxData.push({id: element, display_name: display_name, checked: false} as CheckboxDataInterface);
          });
        });
      this.masterDataTypeAttributesAsCheckboxData = checkboxData;
    }
    
  }

  onToggleSidebar() {
    this.showSidebar = !this.showSidebar;
  }

  handleCloseSidebar() {
    this.showSidebar = false;
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
