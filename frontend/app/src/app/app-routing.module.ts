import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateMasterDtypeComponent } from './model/pages/create-master-dtype/create-master-dtype.component';
import { CreateTransactionTypeComponent } from './model/pages/create-transaction-type/create-transaction-type.component';
import { CreateDocumentTypeComponent } from './model/pages/create-document-type/create-document-type.component';
import { ProcessComponent } from './model/pages/process/process/process.component';

const routes: Routes = [
  {path: 'model/create-master-data-type', component: CreateMasterDtypeComponent, pathMatch: 'full'},
  {path: 'model/create-transaction-type', component: CreateTransactionTypeComponent, pathMatch: 'full'},
  {path: 'model/create-document-type', component: CreateDocumentTypeComponent, pathMatch: 'full'},
  {path: 'model/process', component: ProcessComponent, pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
