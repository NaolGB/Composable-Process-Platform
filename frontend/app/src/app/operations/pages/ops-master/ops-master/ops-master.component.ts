import { Component } from '@angular/core';
import { DataService } from '../../../../services/data.service';
import { Observable, map, of } from 'rxjs';
import { IdsListInterface } from '../../../../interfaces';

@Component({
  selector: 'app-ops-master',
  templateUrl: './ops-master.component.html',
  styleUrl: './ops-master.component.css'
})
export class OpsMasterComponent {
  // Observable dtypes in component
  // async pipe in template
  // ng-template for `else` of the async pipe in the template
  // switchMaps in component
  // $ variable naming convention in component
  // nullush coalescing (const dataToProcess = this.masterDtypeIdsList$?.someProperty ?? defaultValue;)

  masterDtypeIdsList$: Observable<IdsListInterface> | undefined;
  masterDataById$ :Observable<any> | undefined;
  selectedMasterDataColumns: string[] = []

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
    this.masterDataById$ = this.apiServices.getMasterDataById(id)
  }

}
