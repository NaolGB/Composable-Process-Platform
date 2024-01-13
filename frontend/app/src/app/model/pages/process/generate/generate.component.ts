import { Component } from '@angular/core';
import { DataService } from '../../../../services/data.service';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { ProcessTypeParsedData } from '../../../../interfaces';

@Component({
  selector: 'app-generate',
  templateUrl: './generate.component.html',
  styleUrl: './generate.component.css'
})
export class GenerateComponent {
  documentTypeOptions: Array<String> = []

  processForm = this.formBuilder.group({
    nameAndSteps: this.formBuilder.group({
      name: ['', Validators.required],
      steps: ['', Validators.required],
    }),
    documents: this.formBuilder.array([
      this.formBuilder.group({
        documentId: ['', Validators.required]
      })
    ])
  })

  processTypeInDB: Array<String> = []

  constructor(private apiServices: DataService, private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.apiServices.getDocumentTypeIds().subscribe(
      (resposne) => {
        this.documentTypeOptions = resposne['ids']
      }
    )
    this.apiServices.getProcessTypeIds().subscribe(
      (response) => {
        this.processTypeInDB = response['ids']
      }
    )
  }

  get documents() {
    return this.processForm.get("documents") as FormArray
  }

  addDocument() {
    this.documents.push(
      this.formBuilder.group({
        documentId: ['', Validators.required]
      })
    )
  }

  onSubmit() {
    // scrap data
    const parsedPostData: ProcessTypeParsedData = {
			name: this.processForm.get("nameAndSteps")?.get("name")?.value || "",
			steps: this.processForm.get("nameAndSteps")?.get("steps")?.value || "",
      documents: []
		}

    for (let i = 0; i < this.documents.length; i++) {
      parsedPostData.documents.push(this.documents.controls[i].value["documentId"])
      // parsedPostData.documents.push(this.documents.at(i).value("documentId"))
    }

    // console.log(parsedPostData)

    this.apiServices.postProcessType(parsedPostData).subscribe(
    // //   resposnse => {}, // TODO add success message on save in UI
    // //   error => {}
    )
  }
}
