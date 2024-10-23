import { Injectable } from '@angular/core';
import { environment } from "src/environments/environment"
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { take } from "rxjs";
import { Observable } from "rxjs/internal/Observable";

@Injectable({
  providedIn: 'root'
})

export class NajaService {

  base_url = `${environment.baseUrl}`;
  baseUrl = `${environment.baseUrlOkDoutor}`;
  constructor(
    private http: HttpClient,
  ) { }

  getProcedimentosWithEspecialistas(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${this.base_url}/naja/procedimentos`, { headers }).pipe(take(1));
  }

  getGrupoExames(){
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${this.base_url}/naja/produtosWeb`, { headers }).pipe(take(1));
  }

  getConsultas(){
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${this.base_url}/naja/consultas`, { headers }).pipe(take(1));
  }

  getAvailableHoursFromDate(codProcedimento: string, date:string){
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${this.base_url}/naja/procedimentos/${codProcedimento}/slots/${date}`, { headers }).pipe(take(1));
  }

  getAvailableHoursFromMedico(codProcedimento: string, medico:string){
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${this.base_url}/naja/procedimentos/${codProcedimento}/especialistas/${medico}/slots`, { headers }).pipe(take(1));
  }

  createAgendamento(data: any){
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(`${this.base_url}/naja/agendamento`, data, { headers }).pipe(take(1));
  }

  getAgendamentos(){
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${this.base_url}/naja/agendamentos`, { headers }).pipe(take(1));
  }

  getAllAgendamentos(){
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${this.base_url}/naja/agendamentos/all`, { headers }).pipe(take(1));
  }

  confirmCode(body: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<any>(`${this.baseUrl}/mail/confirmCode`, body, { headers }).pipe(take(1));
  }

  sendConfirmationCode(body: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<any>(`${this.baseUrl}/mail/confirmacaoAgendamento`, body, { headers }).pipe(take(1));
  }

  getEmpresas(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any>(`${this.base_url}/naja/empresas`).pipe(take(1));
  }

  getMedicos(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any>(`${this.base_url}/naja/medicos`).pipe(take(1));
  }

  getMedicoByCRM(crm: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any>(`${this.base_url}/naja/medicos/${crm}`).pipe(take(1));
  }

  postMedico(body: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    });
    return this.http.post<any>(`${this.base_url}/naja/medicos`, body, { headers }).pipe(take(1));
  }

  updateMedico(body: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    });
    return this.http.put<any>(`${this.base_url}/naja/medicos`, body, { headers }).pipe(take(1));
  }

  deleteMedico(id: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    });
    return this.http.delete<any>(`${this.base_url}/naja/medicos/${id}`, { headers }).pipe(take(1));
  }
}
