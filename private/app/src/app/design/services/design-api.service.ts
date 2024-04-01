import { HttpClient, HttpParams, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MasterDataTypeInterface } from '../../interfaces/design-interfaces';

@Injectable({
  providedIn: 'root'
})
export class DesignApiService {
  private designApiVersion = 'v1';
  private designBaseUrl = `http://localhost:8000/api/${this.designApiVersion}`;

  constructor(private http: HttpClient) { }

  getMasterDataTypeList(){
    const params = new HttpParams()
      .set('fields', '_id,display_name')
    return this.http.get(`${this.designBaseUrl}/master_data_type`, { params });
  }

  getMasterDataType(id: string) {
    const params = new HttpParams()
      .set('id', id)
    return this.http.get(`${this.designBaseUrl}/master_data_type` , { params });
  }

  postMasterDataType(masterDataType: MasterDataTypeInterface)  {
    return this.http.post(`${this.designBaseUrl}/master_data_type`, masterDataType);
  }
}
