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

  constructor(private apiService: ApiService, private formBuilder: FormBuilder) {
    this.masterDataFromClient = this.formBuilder.group({
      display_name: ['', Validators.required],	
      attributes: this.formBuilder.array([
        this.formBuilder.group({
          dsiaply_name: ['', Validators.required],
          type: [this.fieldTypeOptions[0], Validators.required],
          required: [false, Validators.required],
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
      dsiaply_name: ['', Validators.required],
      type: [this.fieldTypeOptions[0], Validators.required],
      required: [false, Validators.required],
      default_value: ['', Validators.required]
    });

    this.attributes.push(attribute);
    
  }

  removeAttribute(index: number) {
    this.attributes.removeAt(index);
  }

  onSubmit() {
    console.log(this.masterDataFromClient.value);
  }


}
