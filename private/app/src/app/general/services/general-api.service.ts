import { Injectable, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GeneralApiService {
  authService = inject(AuthService)
  private generalBaseUrl = `http://localhost:8000/api/general`;

  constructor(private http: HttpClient) { }

  getUserProfile() {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.idTokenSignal()}`
    })
    const params = new HttpParams()
      .set('fields', 'role')
    return this.http.get(`${this.generalBaseUrl}/user_profile`, { headers, params });
  }
}
