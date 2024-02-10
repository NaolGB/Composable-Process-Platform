import { Component } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { DataService } from '../../../../services/data.service';
import { DocumentTypeInterface } from '../../../../interfaces';

@Component({
  selector: 'app-create-document',
  templateUrl: './create-document.component.html',
  styleUrl: './create-document.component.css'
})
export class CreateDocumentComponent {
  leadObjectType: string = ''
  leadObjectOptions: string[] = []
  leadObject: string = ''
  leadObjectFields: string[] = []
  editableFields: string[] = []
  dtypeOptions = ['string', 'number', 'datetime', 'boolean',]

  documentTypeForm = this.formBuilder.group({
    requiredAttributes: this.formBuilder.group({
      name: ['', Validators.required],
    }),
    extraAttributes: this.formBuilder.array([])
  })

  constructor(private formBuilder: FormBuilder, private apiServices: DataService) {}

  ngOnInit() {
    this.setleadObjectType('master_dtype')
  }

  get extraAttributes() {
    return this.documentTypeForm.get("extraAttributes") as FormArray
  }

  setleadObjectType(objectType: string) {
    this.leadObjectType = objectType
    this.editableFields = []
    if (objectType === 'master_dtype'){
      this.apiServices.getMasterDtypeIds().subscribe(
        (response) => {this.leadObjectOptions = response['ids']}
      )
    }
  }

  selectLeadObject(event: any) {
    const selectedValue = event.target.value;
    this.leadObject = selectedValue
    if (this.leadObjectType === 'master_dtype'){
      this.apiServices.getMasterDtypeById(selectedValue).subscribe(
        (response) => {
          this.leadObjectFields = Object.keys(response.attributes)
        }
      )
    }
  }

  addAttribute() {
		this.extraAttributes.push(
			this.formBuilder.group({
				name: ['', Validators.required],
				dtype: [this.dtypeOptions[0], Validators.required]
			}),
		)
	}

  addEditableField(field: string) {
    this.editableFields.push(field)
  }

  postDocumentType() {
    const parsedPostData: DocumentTypeInterface = {
      _id: '',
      name: this.documentTypeForm.get("requiredAttributes")?.get("name")?.value || "",
      lead_object_type: this.leadObjectType,
      lead_object: this.leadObject,
      editable_fields: this.editableFields,
      attributes: {},
    }

		for (let i = 0; i < this.extraAttributes.length; i++) {
			let attName: string = this.extraAttributes.at(i).value["name"]
			if(attName != null) {
				const dtype: string = this.extraAttributes.at(i).value["dtype"];
				parsedPostData['attributes'][attName] = dtype
			}
		}

    this.apiServices.postDocumentType(parsedPostData).subscribe()
  }
}
