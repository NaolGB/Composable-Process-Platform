import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MasterDtypeIdsRespose, MasterDtypeParsedPostData } from '../interfaces';
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
}
