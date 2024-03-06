import { Component } from '@angular/core';
import { NavigationComponent } from '../../../components/navigation/navigation.component';
import { PreviewComponent } from '../../../components/preview/preview.component';
import { DesignMasterCreateNewComponent } from '../design-master-create-new/design-master-create-new.component';

@Component({
  selector: 'app-master',
  standalone: true,
  imports: [NavigationComponent, PreviewComponent, DesignMasterCreateNewComponent],
  templateUrl: './master.component.html',
  styleUrl: './master.component.scss'
})
export class MasterComponent {
  isSidebarOpen = false;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
