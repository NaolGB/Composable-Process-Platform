import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProcessComponent } from './model/pages/process/process/process.component';
import { CreateDocumentComponent } from './model/pages/document/create-document/create-document.component';
import { CreateMasterComponent } from './model/pages/master/create-master/create-master.component';
import { OpsDashboardComponent } from './operations/pages/ops-dashboard/ops-dashboard.component';

const routes: Routes = [
  {path: 'model/create-master-data-type', component: CreateMasterComponent, pathMatch: 'full'},
  {path: 'model/create-document', component: CreateDocumentComponent, pathMatch: 'full'},
  {path: 'model/process', component: ProcessComponent, pathMatch: 'full'},

  {path: 'operations/dashboard', component: OpsDashboardComponent, pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
