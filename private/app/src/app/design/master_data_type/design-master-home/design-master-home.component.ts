import { Component } from '@angular/core';
import { DesignApiService } from '../../services/design-api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-design-master-home',
  standalone: true,
  imports: [
	CommonModule,
  ],
  templateUrl: './design-master-home.component.html',
  styleUrl: './design-master-home.component.scss'
})
export class DesignMasterHomeComponent {
	masterDataTypeList: any[] = [];
	selectedMasterDataTypeId: string = '';

	constructor(private apiService: DesignApiService) { }

	ngOnInit() {
		this.apiService.getMasterDataTypeList().subscribe(
			(resposne: any) => {
				this.masterDataTypeList = resposne;
				console.log(this.masterDataTypeList);

			},
			(error: any) => {
				console.log(error);
			}
		);
	}

	onMasterDataTypeSelected(id: string) {
		this.selectedMasterDataTypeId = id;
	}
}
