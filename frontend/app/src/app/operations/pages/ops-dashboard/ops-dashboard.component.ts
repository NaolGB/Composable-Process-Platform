import { Component } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { IdsListInterface } from '../../../interfaces';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-ops-dashboard',
  templateUrl: './ops-dashboard.component.html',
  styleUrl: './ops-dashboard.component.css',
})
export class OpsDashboardComponent {
  processTypeIdsList$: Observable<IdsListInterface> | undefined

  constructor(private apiServices: DataService) {}

  ngOnInit() {
    this.processTypeIdsList$ = this.apiServices.getProcessTypeIds()
  }
}
