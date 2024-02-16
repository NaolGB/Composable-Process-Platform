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
  dtypeOptions = ['string', 'number', 'datetime', 'boolean']
  dtypeOptionsExample: {[key: string]: any} = {'string': 'text', 'number': 603.19, 'datetime': new Date('1970-01-01'), 'boolean': true}


  showSidebar: boolean = false;
  showPreviewSection: boolean = true;
  

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
          this.toggleSidebar()
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

  get tempPreviewDocumentData() {
    const data: {[key: string]: string} = {}
    data['name'] = this.documentTypeForm.get('nameAndType')?.get('name')?.value || 'Name field is required'

    for (let i = 0; i < this.extraAttributes.length; i++) {
      let attName: string = this.extraAttributes.at(i).value['name'];
      if (attName != null) {
        const dtypeTypeName: string = this.extraAttributes.at(i).value['dtype'];
        if (attName.length > 0) {
          data[attName] = this.dtypeOptionsExample[dtypeTypeName];
        }
      }
    }

    return data
  }

  get tempPreviewDocumentMasterDataData() {
    const data: {[key: string]: string} = {'name': 'select Lead Master Data'}

    for (let i = 0; i < this.leadObjectFields.length; i++) {
        if (this.leadObjectFields[i].length > 0) {
          if (this.editableFields.includes(this.leadObjectFields[i])) {
            data[this.leadObjectFields[i]] = 'edited value';
          }
          else {
            data[this.leadObjectFields[i]] = 'inherited value';
          }
        }
    }

    return data
  }

  togglePreviewSection(): void {
    this.showPreviewSection = !this.showPreviewSection;
  }
  // Style functions
	getMainSectionHeight(): string {
		return this.showPreviewSection ? '60vh' : '100vh';
	}

	getPreviewSectionHeight(): string {
		return this.showPreviewSection ? '40vh' : '0vh';
	}

  toggleSidebar(): void {
    this.showSidebar = !this.showSidebar;
  }
}
