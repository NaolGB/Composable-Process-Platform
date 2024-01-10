import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateMasterDtypeComponent } from './model/pages/create-master-dtype/create-master-dtype.component';
import { CreateTransactionTypeComponent } from './model/pages/create-transaction-type/create-transaction-type.component';

const routes: Routes = [
  {path: 'model/create-master-data-type', component: CreateMasterDtypeComponent, pathMatch: 'full'},
  {path: 'model/create-transaction-type', component: CreateTransactionTypeComponent, pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
