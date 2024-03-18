import { Component } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MasterDataType } from '../../../services/interface';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'app-design-master-add-new',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    CommonModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule
  ],
  templateUrl: './design-master-add-new.component.html',
  styleUrl: './design-master-add-new.component.scss'
})
export class DesignMasterAddNewComponent {
  masterDataFromClient: FormGroup;
  fieldTypeOptions: string[] = ['string', 'number', 'boolean', 'date', 'Master Data Type'];

  constructor(private apiService: ApiService, private formBuilder: FormBuilder, private dataService: DataService) { 
    this.masterDataFromClient = this.formBuilder.group({
      display_name: ['', Validators.required],	
      attributes: this.formBuilder.array([
        this.formBuilder.group({
          display_name: ['', Validators.required],
          type: [this.fieldTypeOptions[0], Validators.required],
          is_required: [true, Validators.required],
          default_value: ['', Validators.required]
        })
      ])
    });
  }

  get attributes() {
    return this.masterDataFromClient.get('attributes') as FormArray;
  }

  addAttribute() {
    const attribute = this.formBuilder.group({
      display_name: ['', Validators.required],
      type: [this.fieldTypeOptions[0], Validators.required],
      is_required: [false, Validators.required],
      default_value: ['', Validators.required]
    });

    this.attributes.push(attribute);
    
  }

  removeAttribute(index: number) {
    this.attributes.removeAt(index);
  }

  onSubmit() {
    const masterDataFromClientApiFormat: MasterDataType = {
      display_name: this.masterDataFromClient.value.display_name,
      attributes: {}
    }

    console.log(this.dataService.nameToId(this.masterDataFromClient.value.display_name))

    this.attributes.controls.forEach(element => {
      masterDataFromClientApiFormat.attributes[this.dataService.nameToId(element.value.display_name)] = {
        display_name: element.value.display_name,
        type: element.value.type,
        is_required: element.value.is_required,
        default_value: element.value.default_value
      }
    });

    console.log(masterDataFromClientApiFormat);

    this.apiService.createNewMasterDataType(masterDataFromClientApiFormat).subscribe((response: any) => {
      console.log(response);
    });
    // console.log(this.masterDataFromClient.value);
  }


}
