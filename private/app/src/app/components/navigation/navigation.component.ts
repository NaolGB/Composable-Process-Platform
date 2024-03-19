import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent {
  showSidenavText = false;

}
