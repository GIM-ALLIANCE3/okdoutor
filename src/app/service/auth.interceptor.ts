import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Aqui você buscaria o token de alguma forma, como de um serviço de autenticação
    const authToken = this.getAuthToken(); 

    // Clone a requisição para adicionar o novo header.
    const authReq = request.clone({
      headers: request.headers.set('Authorization', `Bearer ${authToken}`)
    });

    // Envie a nova requisição com o cabeçalho adicionado.
    return next.handle(authReq);
  }

  private getAuthToken(): string {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    const token = user?.userAuth?.stsTokenManager?.accessToken;

    return token;
  }
}

// Providencie o interceptor para que ele possa ser utilizado
export const AuthInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: AuthInterceptor,
  multi: true
};
