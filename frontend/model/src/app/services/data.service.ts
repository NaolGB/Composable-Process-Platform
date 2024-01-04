import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MasterDtypeParsedPostData } from '../interfaces';

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
}
