import { Component } from '@angular/core';

@Component({
  selector: 'app-design-master-home',
  standalone: true,
  imports: [],
  templateUrl: './design-master-home.component.html',
  styleUrl: './design-master-home.component.scss'
})
export class DesignMasterHomeComponent {
  dbMasterData: any;
  isSidebarOpen = false;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
