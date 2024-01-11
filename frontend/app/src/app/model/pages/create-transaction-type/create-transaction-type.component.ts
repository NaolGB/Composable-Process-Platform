import { Component } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { FormBuilder, Validators } from '@angular/forms';
import { TransactionTypeParsedPostData } from '../../../interfaces';

@Component({
  selector: 'app-create-transaction-type',
  templateUrl: './create-transaction-type.component.html',
  styleUrl: './create-transaction-type.component.css'
})
export class CreateTransactionTypeComponent {
  masterDtypeOptions: Array<String> = []

  transactionTypeForm = this.formBuilder.group({
    name: ['', Validators.required],
    masterDtype: ['', Validators.required]
  })

  constructor (private formBuilder: FormBuilder, private apiServices: DataService) {}

  ngOnInit(): void {
    this.apiServices.getMasterDtypeIds().subscribe(
      (response) => {this.masterDtypeOptions = response['ids']}
    )
  }

  onSubmit() {
    const parsedPostData: TransactionTypeParsedPostData = {
			name: this.transactionTypeForm.get("name")?.value || "",
			masterDtype: this.transactionTypeForm.get("masterDtype")?.value || ""
		}

    this.apiServices.postTransactionDtype(parsedPostData).subscribe(
    // //   resposnse => {}, // TODO add success message on save in UI
    // //   error => {}
    )
  }

}
