// loading.service.ts
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private _loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _notify: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private messageService: MessageService) { }

  show(): void {
    setTimeout(() => {
      this._loading.next(true);
    }, 100);
  }

  hide(): void {
    setTimeout(() => {
      this._loading.next(false);
    }, 100);
  }

  notify(titulo: string = "Aviso!", mensagem: string = "Código enviado para o e-mail cadastrado.", redirect?: any) {
    this.messageService.clear();
    this.notificar();
    this.messageService.add({
      key: 'block2',
      severity: 'custom-2',
      summary: titulo,
      closable: false,
      detail: mensagem,
      contentStyleClass: 'p-0',
      redirect: redirect
    } as any);
  }

  confirmNotification(titulo: string = "Aviso!", mensagem: string = "Código enviado para o e-mail cadastrado.", redirect?: any) {
    this.messageService.clear();
    this.messageService.add({
      key: 'confirmNotification',
      severity: 'custom-2',
      summary: titulo,
      closable: false,
      detail: mensagem,
      contentStyleClass: 'p-0',
      redirect: redirect
    } as any);
  }

  get loading$(): Observable<boolean> {
    return this._loading.asObservable();
  }

  get notify$(): Observable<boolean> {
    return this._notify.asObservable();
  }

  notificar(){
    this._notify.next(true);
  }

  notificarConfirmacao(){
    this._notify.next(false);
  }
}
