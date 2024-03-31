import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DesignMasterHomeComponent } from './design/master_data_type/design-master-home/design-master-home.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    DesignMasterHomeComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  navbarExpanded = false; 

  toggleNavbar() {
    this.navbarExpanded = !this.navbarExpanded; 
  }
}
