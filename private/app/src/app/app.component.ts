import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import { DesignMasterHomeComponent } from './design/master/design-master-home/design-master-home.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatGridListModule, DesignMasterHomeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  
}
