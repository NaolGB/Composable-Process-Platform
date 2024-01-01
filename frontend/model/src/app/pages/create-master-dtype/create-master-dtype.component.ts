import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
	selector: 'app-create-master-dtype',
	standalone: true,
	imports: [ReactiveFormsModule, CommonModule],
	templateUrl: './create-master-dtype.component.html',
	styleUrl: './create-master-dtype.component.css'
})
export class CreateMasterDtypeComponent {
	masterDtypeForm = this.formBuilder.group({
		name: ['', Validators.required],
		extraAttributes: this.formBuilder.array([
			this.formBuilder.control('')
		])
	})

	constructor(private formBuilder: FormBuilder) {}

	get extraAttributes() {
		return this.masterDtypeForm.get("extraAttributes") as FormArray
	}
}
