import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IdsListInterface, MasterDataTypeInterface, DocumentTypeInterface, ProcessTypeInterface, ProcessInstanceInterface, NewProcessProcessTypeInterface } from '../interfaces';
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
  postMasterDtype(data: MasterDataTypeInterface) {
    const fullUrl = `${this.modelBaseUrl}/master-data-type/`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(fullUrl, data, { headers });
  }
  getMasterDtypeIds(): Observable<IdsListInterface> {
    const fullUrl = `${this.modelBaseUrl}/master-data-type/`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<IdsListInterface>(fullUrl);
  }
  getMasterDtypeById(id: string): Observable<MasterDataTypeInterface> {
    const fullUrl = `${this.modelBaseUrl}/master-data-type/${id}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<MasterDataTypeInterface>(fullUrl);
  }
  

  postDocumentType(data: DocumentTypeInterface) {
    const fullUrl = `${this.modelBaseUrl}/document-type/`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(fullUrl, data, { headers });
  }
  getDocumentTypeIds(): Observable<IdsListInterface> {
    const fullUrl = `${this.modelBaseUrl}/document-type/`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<IdsListInterface>(fullUrl);
  }
  getDocumentTypeById(id: string): Observable<DocumentTypeInterface> {
    const fullUrl = `${this.modelBaseUrl}/document-type/${id}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<DocumentTypeInterface>(fullUrl);
  }


  getProcessTypeIds(): Observable<IdsListInterface> {
    const fullUrl = `${this.modelBaseUrl}/process-type/`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<IdsListInterface>(fullUrl);
  }
  

  postNewProcessType(data: NewProcessProcessTypeInterface) {
    const fullUrl = `${this.modelBaseUrl}/process-type/`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(fullUrl, data, { headers });
  }
  getProcessById(id: string): Observable<ProcessTypeInterface> {
    const fullUrl = `${this.modelBaseUrl}/process/${id}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<ProcessTypeInterface>(fullUrl);
  }
  putProcessById(id: string, data: ProcessTypeInterface) {
    const fullUrl = `${this.modelBaseUrl}/process/${id}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(fullUrl, data, { headers });
  }

  putProcessByIdForPublishing(id: string, data: ProcessTypeInterface) {
    const fullUrl = `${this.modelBaseUrl}/process/publish/${id}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(fullUrl, data, { headers });
  }

  // Operations
  // ----------
  getMasterDataById(masterDtypeId: string) {
    const fullUrl = `${this.operationsBaseUrl}/operations-detail/master_instance/${masterDtypeId}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<any>(fullUrl);
  }

  
  postProcessInstanceById(processId: string) {
    const fullUrl = `${this.operationsBaseUrl}/process-instance/${processId}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(fullUrl, {}, { headers });
  }

  getProcessInstanceById(processInstanceId: string) {
    const fullUrl = `${this.operationsBaseUrl}/process-instance/${processInstanceId}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<ProcessInstanceInterface>(fullUrl);
  }

  getProcessInstanceIdsByProcessTypeId(processTypeId: string) {
    const fullUrl = `${this.operationsBaseUrl}/process-instances/${processTypeId}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<IdsListInterface>(fullUrl);
  }
}
