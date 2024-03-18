import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import { DesignMasterHomeComponent } from './design/master/design-master-home/design-master-home.component';
import { DesignMasterAddNewComponent } from './design/master/design-master-add-new/design-master-add-new.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatGridListModule, DesignMasterHomeComponent, DesignMasterAddNewComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  
}
