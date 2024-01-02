import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
	selector: 'app-create-master-dtype',
	standalone: true,
	imports: [ReactiveFormsModule, CommonModule],
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

	constructor(private formBuilder: FormBuilder) {}

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
		interface ParsedPostData {
			[key: string]: string
		}
		const parsedPostData: ParsedPostData = {
			name: this.masterDtypeForm.get("nameAndType")?.get("name")?.value || ""
		}

		for (let i = 0; i < this.extraAttributes.length; i++) {
			let attName: string = this.extraAttributes.at(i).value["name"]
			if(attName != null) {
				const dtypeTypeName: string = this.extraAttributes.at(i).value["dtype"]["typeName"];
				parsedPostData[attName] = dtypeTypeName
			}
		}

		console.log(parsedPostData)
	}
}
