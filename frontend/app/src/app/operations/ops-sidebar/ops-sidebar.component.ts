import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ops-sidebar',
  templateUrl: './ops-sidebar.component.html',
  styleUrl: './ops-sidebar.component.css'
})
export class OpsSidebarComponent {
  @Input() sidebarType: string = 'read'
  @Input() sidebarData: {[key: string]: string} = {}

  constructor() {}


}
