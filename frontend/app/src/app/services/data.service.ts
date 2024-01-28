import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MasterDtypeIdsRespose, MasterDtypeParsedPostData, DocumentTypeIdsRespose, ProcessTypeParsedData, ProcessTypeIdsResponse } from '../interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private modelBaseUrl = 'http://127.0.0.1:8000/model';
  private operationsBaseUrl = 'http://127.0.0.1:8000/operations';

  constructor(private http: HttpClient) {}

  // Model
  // -----
  postMasterDtype(data: MasterDtypeParsedPostData) {
    const fullUrl = `${this.modelBaseUrl}/master-data-type/`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(fullUrl, data, { headers });
  }

  getMasterDtypeIds(): Observable<MasterDtypeIdsRespose> {
    const fullUrl = `${this.modelBaseUrl}/master-data-type/`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<MasterDtypeIdsRespose>(fullUrl);
  }

  getMasterDtypeById(id: string): Observable<any> {
    const fullUrl = `${this.modelBaseUrl}/master-data-type/${id}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<any>(fullUrl);
  }

  postDocumentType(data: any) {
    const fullUrl = `${this.modelBaseUrl}/document-type/`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(fullUrl, data, { headers });
  }

  getDocumentTypeIds(): Observable<DocumentTypeIdsRespose> {
    const fullUrl = `${this.modelBaseUrl}/document-type/`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<DocumentTypeIdsRespose>(fullUrl);
  }

  getDocumentTypeById(id: string): Observable<any> {
    const fullUrl = `${this.modelBaseUrl}/document-type/${id}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<any>(fullUrl);
  }

  postProcessType(data: ProcessTypeParsedData) {
    const fullUrl = `${this.modelBaseUrl}/process-type/`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(fullUrl, data, { headers });
  }

  getProcessTypeIds(): Observable<ProcessTypeIdsResponse> {
    const fullUrl = `${this.modelBaseUrl}/process-type/`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<ProcessTypeIdsResponse>(fullUrl);
  }

  getProcessById(id: string | number): Observable<ProcessTypeParsedData> {
    const fullUrl = `${this.modelBaseUrl}/process/${id}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<ProcessTypeParsedData>(fullUrl);
  }

  putProcessById(id: string | number, data: ProcessTypeParsedData) {
    const fullUrl = `${this.modelBaseUrl}/process/${id}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(fullUrl, data, { headers });
  }

  putProcessByIdForPublishing(id: string | number, data: ProcessTypeParsedData) {
    const fullUrl = `${this.modelBaseUrl}/process/publish/${id}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(fullUrl, data, { headers });
  }

  // Operations
  // ----------
  postProcessInstanceById(processId: string | number) {
    const fullUrl = `${this.operationsBaseUrl}/process-instance/${processId}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(fullUrl, {}, { headers });
  }

  getProcessInstanceIdsByProcessTypeId(processTypeId: string | number) {
    const fullUrl = `${this.operationsBaseUrl}/process-instances/${processTypeId}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<any>(fullUrl);
  }
}
