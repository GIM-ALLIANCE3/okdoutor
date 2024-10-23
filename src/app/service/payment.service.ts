import { Injectable } from '@angular/core';
import { environment } from "src/environments/environment"
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { take } from "rxjs";
import { Observable } from "rxjs/internal/Observable";


@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  base_url = `${environment.baseUrl}`;
  baseUrl = `${environment.baseUrlOkDoutor}`;
  constructor(
    private http: HttpClient,
  ) { }

  makePayment(data: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(`${this.base_url}/make-payment`, data, { headers }).pipe(take(1));
  }
}
