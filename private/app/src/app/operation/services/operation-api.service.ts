import { Injectable, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OperationApiService {
  authService = inject(AuthService);
  private operationBaseUrl = `http://localhost:8000/api/operation`;
  
  constructor(private http: HttpClient) { }

  // Process Instance ---------------------------------------------------------
  getProcessInstanceList(processType: string){
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.idTokenSignal()}`
    })
    const params = new HttpParams()
      .set('process_type', processType)
      .set('fields', '_id,current_step')
    return this.http.get(`${this.operationBaseUrl}/process`, { headers, params });
  }

  createProcessInstance(processTypeId: string){
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.idTokenSignal()}`
    })
    const params = new HttpParams()
      .set('process_type', processTypeId)
      
    return this.http.post(`${this.operationBaseUrl}/process/`, { headers, params });
  }
}
