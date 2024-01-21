import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateMasterDtypeComponent } from './model/pages/create-master-dtype/create-master-dtype.component';
import { ProcessComponent } from './model/pages/process/process/process.component';
import { CreateDocumentComponent } from './model/pages/document/create-document/create-document.component';

const routes: Routes = [
  {path: 'model/create-master-data-type', component: CreateMasterDtypeComponent, pathMatch: 'full'},
  {path: 'model/create-document', component: CreateDocumentComponent, pathMatch: 'full'},
  {path: 'model/process', component: ProcessComponent, pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
