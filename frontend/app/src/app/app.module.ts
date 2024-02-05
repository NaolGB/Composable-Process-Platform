import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NavBarComponent } from './model/nav-bar/nav-bar.component';
import { ProcessPreviewComponent } from './model/process-preview/process-preview.component';
import { ProcessComponent } from './model/pages/process/process/process.component';
import { CreateDocumentComponent } from './model/pages/document/create-document/create-document.component';
import { MonacoEditorComponent } from './model/monaco-editor/monaco-editor.component';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { CreateMasterComponent } from './model/pages/master/create-master/create-master.component';
import { OpsNavBarComponent } from './operations/ops-nav-bar/ops-nav-bar.component';
import { OpsDashboardComponent } from './operations/pages/ops-dashboard/ops-dashboard.component';
import { OpsMasterComponent } from './operations/pages/ops-master/ops-master/ops-master.component';
import { OpsSidebarComponent } from './operations/ops-sidebar/ops-sidebar.component';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    ProcessPreviewComponent,
    ProcessComponent,
    CreateDocumentComponent,
    MonacoEditorComponent,
    CreateMasterComponent,
    OpsNavBarComponent,
    OpsDashboardComponent,
    OpsMasterComponent,
    OpsSidebarComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    MonacoEditorModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
