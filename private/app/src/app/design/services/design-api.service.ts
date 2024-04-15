import { HttpClient, HttpHeaders, HttpParams, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { DocumentTypeInterface, MasterDataTypeInterface } from '../../interfaces/design-interfaces';
import { AuthService } from '../../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class DesignApiService {
  authService = inject(AuthService);
  private designBaseUrl = `http://localhost:8000/api/design`;

  constructor(private http: HttpClient) {}
  // Master Data Type ---------------------------------------------------------
  getMasterDataTypeList(){
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.idTokenSignal()}`
    })
    const params = new HttpParams()
      .set('fields', '_id,display_name')
    return this.http.get(`${this.designBaseUrl}/master_data_type`, { headers, params });
  }

  getMasterDataType(id: string) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.idTokenSignal()}`
    })
    const params = new HttpParams()
      .set('id', id)
    return this.http.get(`${this.designBaseUrl}/master_data_type` , { headers, params });
  }

  postMasterDataType(masterDataType: MasterDataTypeInterface)  {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.idTokenSignal()}`
    })
    return this.http.post(`${this.designBaseUrl}/master_data_type`, masterDataType, { headers });
  }

  putMasterDataType(masterDataType: MasterDataTypeInterface, id: string) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.idTokenSignal()}`
    })
    const params = new HttpParams()
      .set('id', id)
    return this.http.put(`${this.designBaseUrl}/master_data_type`, masterDataType, { headers, params });
  }

  // Document Type ---------------------------------------------------------
  getDocumentTypeList() {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.idTokenSignal()}`
    })
    const params = new HttpParams()
      .set('fields', '_id,display_name')
    return this.http.get(`${this.designBaseUrl}/document_type`, { headers, params });
  }

  postDocumentType(documentType: DocumentTypeInterface) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.idTokenSignal()}`
    })
    return this.http.post(`${this.designBaseUrl}/document_type/`, documentType, { headers });
  }
}
