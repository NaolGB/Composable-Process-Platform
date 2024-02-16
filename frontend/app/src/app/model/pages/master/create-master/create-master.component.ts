import { Component } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { DataService } from '../../../../services/data.service';
import { AlertInterface, MasterDataTypeInterface } from '../../../../interfaces';

@Component({
  selector: 'app-create-master',
  templateUrl: './create-master.component.html',
  styleUrl: './create-master.component.css',
})
export class CreateMasterComponent {
  dtypeOptions = ['string', 'number', 'datetime', 'boolean'];
  dtypeOptionsExample: {[key: string]: any} = {'string': 'text', 'number': 603.19, 'datetime': new Date('1970-01-01'), 'boolean': true}
  showSidebar: boolean = false;
  showPreviewSection: boolean = true;
  alerts: AlertInterface[] = []
  nextId: number = 0

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

  addAlert(alert: AlertInterface): void {
    alert.id = this.nextId++
    this.alerts.push(alert);

    // Remove the alert after 3 seconds
    setTimeout(() => {
      this.removeAlert(alert.id);
    }, 3000);
  }

  removeAlert(id: number): void {
    this.alerts = this.alerts.filter(alert => alert.id !== id);
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

  get tempPreviewData() {
    const data: {[key: string]: string} = {}
    data['name'] = this.masterDtypeForm.get('nameAndType')?.get('name')?.value || 'Name field is required'

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

	// Style functions
	getMainSectionHeight(): string {
		return this.showPreviewSection ? '60vh' : '100vh';
	}

	getPreviewSectionHeight(): string {
		return this.showPreviewSection ? '40vh' : '0vh';
	}
}