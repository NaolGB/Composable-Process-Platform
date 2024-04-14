import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService } from '../../../services/data.service';
import { DesignApiService } from '../../services/design-api.service';
import { ApiResponsePackageInterface, CheckboxDataInterface, DocumentTypeInterface } from '../../../interfaces/design-interfaces';
import { OverlaySidebarCheckboxComponent } from '../../../components/overlay-sidebar-checkbox/overlay-sidebar-checkbox.component';
import { FunctionApiService } from '../../../general/services/function-api.service';
import { FunctionGroup, FunctionInputGroup } from '../../../types/function-form-types';

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
  master_data_type_options: string | undefined;

  functionsList: any[] = [];

  constructor(private formBuilder: FormBuilder, private dataService: DataService, private apiService: DesignApiService, private functionApiService: FunctionApiService) {
    this.documentTypeForm = this.formBuilder.group({
      display_name: ['', dataService.generalFormInputValidator()],
      master_data_type: this.formBuilder.group({
        id: [''],
        fields_to_update: [''],
        fields_to_display: ['']
      }),
      functions: this.formBuilder.array<FunctionGroup>([]),
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
    this.functionApiService.getFunctionList().subscribe(
      (response: any) => {
        this.functionsList = response;
        console.log(response);
        console.log(this.functionsList);
      },
      (error: any) => {
        console.log(error);
      }
    )
  }

  get attributes() {
    return this.documentTypeForm.get('attributes') as FormArray;
  }

  get displayName()  {
    return this.documentTypeForm.get('display_name')?.value;
  }

  get master_data_type() {
    return this.documentTypeForm.get('master_data_type') as FormGroup;
  }

  get functions() {
    return this.documentTypeForm.get('functions') as FormArray;
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
            checkboxData.push({id: element, display_name: display_name, is_checked: false} as CheckboxDataInterface);
          });
        });
      this.masterDataTypeAttributesAsCheckboxData = checkboxData;
    }
  }

  onToggleSidebar() {
    this.showSidebar = !this.showSidebar;
  }

  onOpenSidebar(master_data_typeFieldOption: string) {
    this.master_data_type_options = master_data_typeFieldOption;
    this.showSidebar = true;
  }

  handleCloseSidebar() {
    this.showSidebar = false;
  }

  handleSidebarData(checkedBoxIds: string) {
    if (this.master_data_type_options === 'fields_to_display') {
      this.master_data_type.controls['fields_to_display'].setValue(checkedBoxIds);
    }
    else if (this.master_data_type_options === 'fields_to_update') {
      this.master_data_type.controls['fields_to_update'].setValue(checkedBoxIds);
    }
    this.showSidebar = false;
  }

  onAddAttribute() {
    const attribute = this.formBuilder.group({
      display_name: ['', this.dataService.generalFormInputValidator()],
      type: [this.documentAttributeTypeOptions[0], this.dataService.generalFormInputValidator()],
      is_required: [false, Validators.required],
      default_value: ['', this.dataService.generalFormInputValidator()]
    });
    this.attributes.push(attribute);
  }

  onAddFunction() {
    const functionGroup = this.formBuilder.group({
      functionId: [''],
      functionInputs: this.formBuilder.array<FunctionInputGroup>([]),
      functionOutputs: this.formBuilder.array<FunctionInputGroup>([])
    });
    this.functions.push(functionGroup);
  }
  
  onFunctionSelect(index: number) {
    const selectedFunctionId = this.functions.at(index).get('functionId')?.value;
    const functionFromFunctionListBySelectedId = this.functionsList.find((func: any) => func._id === selectedFunctionId);
    console.log(index, this.functionsList, selectedFunctionId, functionFromFunctionListBySelectedId);
    const currentFunctionGroup = this.functions.at(index) as FormGroup;
    
    const inputsArray: AbstractControl[] = [];
    Object.keys(functionFromFunctionListBySelectedId.inputs).forEach((key: string) => {
      inputsArray.push(this.formBuilder.group({
        source: ['static'],
        field: ['']
      }));
    })
    currentFunctionGroup.setControl('functionInputs', this.formBuilder.array(inputsArray));
    
    const outputsArray: AbstractControl[] = [];
    Object.keys(functionFromFunctionListBySelectedId.outputs).forEach((key: string) => {
      outputsArray.push(this.formBuilder.group({
        destination: [''],
        field: ['']
      }));
    })
    currentFunctionGroup.setControl('functionOutputs', this.formBuilder.array(outputsArray));
  }

  onRemoveAttribute(index: number) {
    this.attributes.removeAt(index);
    this.functions
  }

  onRemoveFunction(index: number) {
    this.functions.removeAt(index);
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
      master_data_type: {
        id: this.masterDataTypeId!,
        fields_to_update: this.documentTypeForm.value.master_data_type.fields_to_update,
        fields_to_display: this.documentTypeForm.value.master_data_type.fields_to_display
      },
      functions: {},
      attributes: {}
    };

    this.attributes.controls.forEach((control, index) => {
      const attribute = control.value;
      
      let attribute_id = this.dataService.nameToId(attribute.display_name);
      let attribute_id_is_unique = false;
      let attribute_id_variation = 1;
      while (!attribute_id_is_unique) {
        if (documentType.attributes[attribute_id]) {
          attribute_id = this.dataService.nameToId(attribute.display_name, attribute_id_variation++);
        } else {
          attribute_id_is_unique = true;
        }
      }

      documentType.attributes[this.dataService.nameToId(attribute.display_name)] = {
        display_name: attribute.display_name,
        type: attribute.type,
        is_required: attribute.is_required,
        default_value: attribute.default_value
      };
    });

    // console.log(documentType);
    console.log(this.documentTypeForm.getRawValue());

  }

  functionTrackBy(index: number, item: any) {
    return index;
  }

  inputTrackBy(index: number, item: any) {
    return index;
  }

  outputTrackBy(index: number, item: any) {
    return index;
  }
}
