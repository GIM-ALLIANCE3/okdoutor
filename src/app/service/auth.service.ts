import { Injectable } from '@angular/core';
import { environment } from "src/environments/environment"
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { take } from "rxjs";
import { Observable } from "rxjs/internal/Observable";
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  base_url = `${environment.baseUrl}`;
  constructor(
    private http: HttpClient,
  ) { }

  login(Email: string, Password: string): Observable<any> {
    const body = {
      email: Email,
      password: Password
    };
    return this.http.post(`${this.base_url}/login`, body, {}).pipe(take(1));
  }

  loginAdmin(Email: string, Password: string): Observable<any> {
    const body = {
      email: Email,
      password: Password
    };
    return this.http.post(`${this.base_url}/admin/login`, body, {}).pipe(take(1));
  }

  createUser(body: any):  Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(`${this.base_url}/register`, body, { headers }).pipe(take(1));
  }

  getAssinatura(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${this.base_url}/user/assinatura`, { headers }).pipe(take(1));
  }

  sendResetPassword(email: any): Observable<any> {
    return this.http.get(`${this.base_url}/user/reset-password/${email}`, {}).pipe(take(1));
  }

  resetPassword(body: any): Observable<any> {
    return this.http.post(`${this.base_url}/user/reset-password`, body, {}).pipe(take(1));
  }
}
