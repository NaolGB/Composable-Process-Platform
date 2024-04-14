import { Injectable, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FunctionApiService {
  authService = inject(AuthService);
  private functionBaseUrl = `http://localhost:8000/api/function`;

  constructor(private http: HttpClient) { }

  // Function ---------------------------------------------------------
  getFunctionList(){
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.idTokenSignal()}`
    })
    const params = new HttpParams()
      .set('fields', '_id,display_name,description,inputs,outputs')
    return this.http.get(`${this.functionBaseUrl}`, { headers, params });
  }
}
