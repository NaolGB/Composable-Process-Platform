import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SidebarPackage } from '../../interfaces';

@Component({
  selector: 'app-ops-sidebar',
  templateUrl: './ops-sidebar.component.html',
  styleUrl: './ops-sidebar.component.css'
})
export class OpsSidebarComponent {
  /**
   * sidebarType: the type of method performed on the sidebar: CREATE: create, READ: read, UPDATE: update
   * sidebarData: the data that is being rendered
   *    1. if read: the sidebarData is the data displayed, no change to the data
   *    2. if create or update: the sidebarData is the {column: value} 
   *          where the value can be empty, curent value, or default value
   * the medataData holds information about the sidebarData when neccessary
   *    - data types of columns for data type enforcing
   * 
   * on create/update, sidebar emits the sidebarData on click `Save/Apply` through dataEvent 
   * and this is read by the parent
   */
  @Input() sidebarPackage: SidebarPackage | undefined

  @Output() dataEvent = new EventEmitter<SidebarPackage>();

  constructor() {}

  onClickSave() {
    this.dataEvent.emit(this.sidebarPackage)
  }

  trackByEntry(index: number, item: any): string {
    return item.key; 
  }

}
