import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreateMasterDtypeComponent } from './model/pages/create-master-dtype/create-master-dtype.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NavBarComponent } from './model/nav-bar/nav-bar.component';
import { CreateTransactionTypeComponent } from './model/pages/create-transaction-type/create-transaction-type.component';
import { CreateDocumentTypeComponent } from './model/pages/create-document-type/create-document-type.component';

@NgModule({
  declarations: [
    AppComponent,
    CreateMasterDtypeComponent,
    NavBarComponent,
    CreateTransactionTypeComponent,
    CreateDocumentTypeComponent
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
