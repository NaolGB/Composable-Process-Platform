import { Component } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { DataService } from '../../../../services/data.service';
import { MasterDataTypeInterface } from '../../../../interfaces';

@Component({
  selector: 'app-create-master',
  templateUrl: './create-master.component.html',
  styleUrl: './create-master.component.css',
})
export class CreateMasterComponent {
  dtypeOptions = ['string', 'number', 'datetime', 'boolean'];
  showSidebar: boolean = false;
  showPreviewSection: boolean = true;

  masterDtypeForm = this.formBuilder.group({
    nameAndType: this.formBuilder.group({
      name: ['', Validators.required],
    }),
    extraAttributes: this.formBuilder.array([
      this.formBuilder.group({
        name: ['', Validators.required],
        dtype: [this.dtypeOptions[0], Validators.required],
      }),
    ]),
  });

  masterDtypeInDB: string[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private apiServices: DataService
  ) {}

  ngOnInit() {
    // sidebar
    this.apiServices.getMasterDtypeIds().subscribe((response) => {
      this.masterDtypeInDB = response['ids'];
    });
  }

  get extraAttributes() {
    return this.masterDtypeForm.get('extraAttributes') as FormArray;
  }

  addAttribute() {
    this.extraAttributes.push(
      this.formBuilder.group({
        name: ['', Validators.required],
        dtype: [this.dtypeOptions[0], Validators.required],
      })
    );
  }

  toggleSidebar(): void {
    this.showSidebar = !this.showSidebar;
  }

  togglePreviewSection(): void {
    this.showPreviewSection = !this.showPreviewSection;
  }

  onSubmit() {
    const parsedPostData: MasterDataTypeInterface = {
      name: this.masterDtypeForm.get('nameAndType')?.get('name')?.value || '',
      _id: '',
      organization: '',
      attributes: {},
    };

    for (let i = 0; i < this.extraAttributes.length; i++) {
      let attName: string = this.extraAttributes.at(i).value['name'];
      if (attName != null) {
        const dtypeTypeName: string = this.extraAttributes.at(i).value['dtype'];
        parsedPostData.attributes[attName] = dtypeTypeName;
      }
    }

    this.apiServices.postMasterDtype(parsedPostData).subscribe();
  }

	// Style functions
	getMainSectionHeight(): string {
		return this.showPreviewSection ? '60vh' : '100vh';
	}

	getPreviewSectionHeight(): string {
		return this.showPreviewSection ? '40vh' : '0vh';
	}
}
