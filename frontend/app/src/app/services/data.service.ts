import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MasterDtypeIdsRespose, MasterDtypeParsedPostData, TransactionTypeParsedPostData, TransactionTypeIdsRespose, DocumentTypeParsedPostData, DocumentTypeIdsRespose, ProcessTypeParsedData, ProcessTypeIdsResponse } from '../interfaces';
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

  postTransactionDtype(data: TransactionTypeParsedPostData) {
    const fullUrl = `${this.baseUrl}/transaction-type/`
    const headers = new HttpHeaders({ "Content-Type": "application/json", })
    return this.http.post(fullUrl, data, {headers})
  }

  getTransactionTypeIds(): Observable<TransactionTypeIdsRespose> {
    const fullUrl = `${this.baseUrl}/transaction-type/`
    const headers = new HttpHeaders({ "Content-Type": "application/json", })
    return this.http.get<TransactionTypeIdsRespose>(fullUrl)
  }

  postDocumentType(data: DocumentTypeParsedPostData) {
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

  getProcessById(id: string): Observable<ProcessTypeParsedData> {
    const fullUrl = `${this.baseUrl}/process/${id}`
    const headers = new HttpHeaders({ "Content-Type": "application/json", })
    return this.http.get<ProcessTypeParsedData>(fullUrl)
  }
}
