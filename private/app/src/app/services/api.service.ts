import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

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
}
