import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DataService } from '../../../services/data.service';
import { DocumentTypeParsedPostData } from '../../../interfaces';

@Component({
  selector: 'app-create-document-type',
  templateUrl: './create-document-type.component.html',
  styleUrl: './create-document-type.component.css'
})
export class CreateDocumentTypeComponent {
  transactionTypeOptions: Array<String> = []

  documentTypeForm = this.fomrBuilder.group({
    name: ['', Validators.required],
    transactionType: ['', Validators.required]
  })

  constructor(private fomrBuilder: FormBuilder, private apiServices: DataService) {}

  ngOnInit(): void {
    this.apiServices.getTransactionTypeIds().subscribe(
      (response) => this.transactionTypeOptions = response['ids']
    )
  }

  onSubmit() {
    const parsedPostData: DocumentTypeParsedPostData = {
			name: this.documentTypeForm.get("name")?.value || "",
			transactionType: this.documentTypeForm.get("transactionType")?.value || ""
		}

    console.log(parsedPostData)

  //   this.apiServices.(parsedPostData).subscribe(
  //   // //   resposnse => {}, // TODO add success message on save in UI
  //   // //   error => {}
  //   )
  }

}
