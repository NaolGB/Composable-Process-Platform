import { Component } from '@angular/core';
import { DataService } from '../../../../services/data.service';
import { Observable, every, map, of } from 'rxjs';
import { IdsListInterface } from '../../../../interfaces';

@Component({
  selector: 'app-ops-master',
  templateUrl: './ops-master.component.html',
  styleUrl: './ops-master.component.css'
})
export class OpsMasterComponent {
  masterDtypeIdsList$: Observable<IdsListInterface> | undefined;
  masterDataById$ :Observable<any> | undefined;
  auxiliarySection: boolean = false;
  sidebarType: string = 'read'
  sidebarData: any = {}
  masterDataType: string = ''

  constructor(private apiServices: DataService) {}

  ngOnInit() {
    this.masterDtypeIdsList$ = this.apiServices.getMasterDtypeIds()
    
    // get an initial master data selected
    this.apiServices.getMasterDtypeIds().subscribe((ids: IdsListInterface) => {
      if (ids.ids && ids.ids.length > 0) {
        this.masterDataById$ = this.apiServices.getMasterDataById(ids.ids[0])
      }
    });
  }

  selectMasterDataById(id: string) {
    this.masterDataType = id
    this.masterDataById$ = this.apiServices.getMasterDataById(id)
  }

  toggleAuxiliarySection() {
    this.auxiliarySection = !this.auxiliarySection;
  }

  showAuxiliarySection(sidebarType: string, sidebarData: {}, metaData: {}) {
    // read ops-sidebar componenet docstrinng for input information
    this.sidebarType = sidebarType
    this.sidebarData = sidebarData
    this.auxiliarySection = true
  }

  createSidebarData(columns: string[]) {
    const data: {[key: string]: string} = {}
    columns.forEach(element => {
      data[element] = ''
    })

    return data
  }

  applySidebarEffects($event: any) {
    if ($event.eventType === 'create') {
      this.apiServices.postMasterData(this.masterDataType, $event.data).subscribe()
    }
  }
}
