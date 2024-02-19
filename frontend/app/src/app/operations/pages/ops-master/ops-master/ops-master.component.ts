import { Component } from '@angular/core';
import { DataService } from '../../../../services/data.service';
import { Observable } from 'rxjs';
import { IdsListInterface, SidebarPackage } from '../../../../interfaces';

@Component({
  selector: 'app-ops-master',
  templateUrl: './ops-master.component.html',
  styleUrl: './ops-master.component.css'
})
export class OpsMasterComponent {
  masterDtypeIdsList$: Observable<IdsListInterface> | undefined;
  masterDataById$: Observable<any> | undefined;
  auxiliarySection: boolean = false;
  sidebarPackage: SidebarPackage | undefined
  masterDataType: string = ''

  showSidebar: boolean = false;

  constructor(private apiServices: DataService) {}

  ngOnInit() {
    this.masterDtypeIdsList$ = this.apiServices.getMasterDtypeIds()
  }

  selectMasterDataById(id: string) {
    this.masterDataType = id
    this.masterDataById$ = this.apiServices.getMasterDataByDataType(id)
  }

  toggleAuxiliarySection() {
    this.auxiliarySection = !this.auxiliarySection;
  }

  showAuxiliarySectionCreateMasterData(all_fields: string[], editable_fields: string[]) {
    // read ops-sidebar componenet docstrinng for input information
    this.sidebarPackage = {
        identifier: '',
        sidebarType: 'create',
        selector: {selectorType: '', selectorId: ''},
        content: {
          allFields: all_fields,
          editableFields: editable_fields
        },
        sidebarData: this.createSidebarData(all_fields),
    }
    this.auxiliarySection = true
    this.toggleSidebar()
  }

  destroyAuxiliarySection() {
    this.sidebarPackage = undefined
    this.auxiliarySection = false
  }

  createSidebarData(columns: string[]) {
    const data: {[key: string]: string} = {}
    columns.forEach(element => {
      data[element] = ''
    })

    return data
  }

  applySidebarEffects($event: SidebarPackage) {
    if ($event.sidebarType === 'create') {
      this.apiServices.postMasterData(this.masterDataType, $event.sidebarData).subscribe()
    }
    this.toggleSidebar()
  }

  toggleSidebar(): void {
    this.showSidebar = !this.showSidebar;
  }
}
