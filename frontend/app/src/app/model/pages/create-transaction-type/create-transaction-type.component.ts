import { Component } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-transaction-type',
  templateUrl: './create-transaction-type.component.html',
  styleUrl: './create-transaction-type.component.css'
})
export class CreateTransactionTypeComponent {
  masterDtypeOptions: Array<String> = []

  transactionTypeForm = this.formBuilder.group({
    name: ['', Validators.required],
    sourceInstance: ['', Validators.required]
  })

  constructor (private formBuilder: FormBuilder, private apiServices: DataService) {}

  ngOnInit(): void {
    this.apiServices.getMasterDtypeIds().subscribe(
      (response) => {this.masterDtypeOptions = response['ids']}
    )
  }

}
