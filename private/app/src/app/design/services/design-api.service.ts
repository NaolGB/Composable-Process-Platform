import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

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
}
