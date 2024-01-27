import { Component } from '@angular/core';
import { MasterDtypeParsedPostData } from '../../../../interfaces';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { DataService } from '../../../../services/data.service';

@Component({
  selector: 'app-create-master',
  templateUrl: './create-master.component.html',
  styleUrl: './create-master.component.css'
})
export class CreateMasterComponent {
  dtypeOptions = [ 'string', 'number', 'datetime', 'boolean',]

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

	masterDtypeInDB: Array<String> = []

	constructor(private formBuilder: FormBuilder, private apiServices: DataService) {}

	ngOnInit() {
		// sidebar
		this.apiServices.getMasterDtypeIds().subscribe(
			(response) => {
				this.masterDtypeInDB = response['ids']
			}
		)
	}

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

		this.apiServices.postMasterDtype(parsedPostData).subscribe()
	}
}
