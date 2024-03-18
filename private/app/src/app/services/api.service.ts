import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MasterDataType } from './interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private designBaseUrl = 'http://localhost:8000/design';

  constructor(private http: HttpClient) { }

  getMasterDataOverview() {
    const params = new HttpParams()
      .set('fields', '_id,display_name')
    return this.http.get(`${this.designBaseUrl}/master-data-type`, { params });
  }

  getMasterDataTypeById(masterDataTypeId: string) {
    const params = new HttpParams()
      .set('id', masterDataTypeId)
    return this.http.get(`${this.designBaseUrl}/master-data-type`, { params });
  }

  createNewMasterDataType(masterDataType: MasterDataType) {
    return this.http.post(`${this.designBaseUrl}/master-data-type/`, masterDataType);
  }
}
