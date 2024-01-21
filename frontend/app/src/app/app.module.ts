import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NavBarComponent } from './model/nav-bar/nav-bar.component';
import { ProcessPreviewComponent } from './model/process-preview/process-preview.component';
import { CreateMasterDtypeComponent } from './model/pages/create-master-dtype/create-master-dtype.component';
import { ProcessComponent } from './model/pages/process/process/process.component';
import { CreateDocumentComponent } from './model/pages/document/create-document/create-document.component';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    CreateMasterDtypeComponent,
    ProcessPreviewComponent,
    ProcessComponent,
    CreateDocumentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
