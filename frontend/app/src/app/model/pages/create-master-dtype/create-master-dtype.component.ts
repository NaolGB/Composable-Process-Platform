import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { MasterDtypeParsedPostData } from '../../../interfaces';
import { DataService } from '../../../services/data.service';


@Component({
  selector: 'app-create-master-dtype',
  templateUrl: './create-master-dtype.component.html',
  styleUrl: './create-master-dtype.component.css'
})
export class CreateMasterDtypeComponent {
  dtypeOptions = [
		{typeName: 'string'},
		{typeName: 'number'},
		{typeName: 'datetime'},
		{typeName: 'boolean'},
	]

  masterDtypeForm = this.formBuilder.group({
		nameAndType: this.formBuilder.group({
			name: ['', Validators.required],
		}),
		extraAttributes: this.formBuilder.array([
			this.formBuilder.group({
				name: ['', Validators.required],
				dtype: [this.dtypeOptions[0], Validators.required]
			}),
		])
	})

  constructor(private formBuilder: FormBuilder, private apiServices: DataService) {}

  get extraAttributes() {
		return this.masterDtypeForm.get("extraAttributes") as FormArray
	}

	addAttribute() {
		this.extraAttributes.push(
			this.formBuilder.group({
				name: ['', Validators.required],
				dtype: [this.dtypeOptions[0], Validators.required]
			}),
		)
	}

  onSubmit() {
		
		const parsedPostData: MasterDtypeParsedPostData = {
			name: this.masterDtypeForm.get("nameAndType")?.get("name")?.value || ""
		}

		for (let i = 0; i < this.extraAttributes.length; i++) {
			let attName: string = this.extraAttributes.at(i).value["name"]
			if(attName != null) {
				const dtypeTypeName: string = this.extraAttributes.at(i).value["dtype"]["typeName"];
				parsedPostData[attName] = dtypeTypeName
			}
		}

    this.apiServices.postMasterDtype(parsedPostData).subscribe(
    //   resposnse => {}, // TODO add success message on save in UI
    //   error => {}
    )
	}

}
