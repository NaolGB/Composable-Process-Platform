import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MasterDtypeIdsRespose, MasterDtypeParsedPostData, DocumentTypeIdsRespose, ProcessTypeParsedData, ProcessTypeIdsResponse } from '../interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private baseUrl = 'http://127.0.0.1:8000/model'

  constructor(private http: HttpClient) { }

  postMasterDtype(data: MasterDtypeParsedPostData) {
    const fullUrl = `${this.baseUrl}/master-data-type/`
    const headers = new HttpHeaders({ "Content-Type": "application/json", })
    return this.http.post(fullUrl, data, {headers})
  }

  getMasterDtypeIds(): Observable<MasterDtypeIdsRespose> {
    const fullUrl = `${this.baseUrl}/master-data-type/`
    const headers = new HttpHeaders({ "Content-Type": "application/json"})
    return this.http.get<MasterDtypeIdsRespose>(fullUrl)
  }

  getMasterDtypeById(id: string): Observable<any> {
    const fullUrl = `${this.baseUrl}/master-data-type/${id}`
    const headers = new HttpHeaders({ "Content-Type": "application/json"})
    return this.http.get<any>(fullUrl)
  }

  postDocumentType(data: any) {
    const fullUrl = `${this.baseUrl}/document-type/`
    const headers = new HttpHeaders({ "Content-Type": "application/json", })
    return this.http.post(fullUrl, data, {headers})
  }

  getDocumentTypeIds(): Observable<DocumentTypeIdsRespose> {
    const fullUrl = `${this.baseUrl}/document-type/`
    const headers = new HttpHeaders({ "Content-Type": "application/json", })
    return this.http.get<DocumentTypeIdsRespose>(fullUrl)
  }

  postProcessType(data: ProcessTypeParsedData) {
    const fullUrl = `${this.baseUrl}/process-type/`
    const headers = new HttpHeaders({ "Content-Type": "application/json", })
    return this.http.post(fullUrl, data, {headers})
  }

  getProcessTypeIds(): Observable<ProcessTypeIdsResponse> {
    const fullUrl = `${this.baseUrl}/process-type/`
    const headers = new HttpHeaders({ "Content-Type": "application/json", })
    return this.http.get<ProcessTypeIdsResponse>(fullUrl)
  }

  getProcessById(id: string | number): Observable<ProcessTypeParsedData> {
    const fullUrl = `${this.baseUrl}/process/${id}`
    const headers = new HttpHeaders({ "Content-Type": "application/json", })
    return this.http.get<ProcessTypeParsedData>(fullUrl)
  }

  putProcessById(id: string | number, data: ProcessTypeParsedData) {
    const fullUrl = `${this.baseUrl}/process/${id}`
    const headers = new HttpHeaders({ "Content-Type": "application/json", })
    return this.http.put(fullUrl, data, {headers})
  }
}
