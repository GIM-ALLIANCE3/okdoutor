import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingService } from '../service/loading.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-change-password',
  standalone: false,
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent implements OnInit {
  newSenha: FormGroup = new FormGroup({
    senha: new FormControl('', Validators.required),
    confirmarSenha: new FormControl('', Validators.required)
  });
  displayModal = false;
  display = false;

  oobCode = '';

  constructor(private loading: LoadingService, private activatedRoute: ActivatedRoute, private authService: AuthService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.oobCode = params['oobCode'];
    });
  }

  changePassword() {
    this.loading.show();
    const senhaControl = this.newSenha.get('senha');
    const senha = senhaControl!.value;
    const confirmarSenhaControl = this.newSenha.get('confirmarSenha');
    const confirmarSenha = confirmarSenhaControl!.value;
    if (this.newSenha.valid) {
      this.authService.resetPassword({token: this.oobCode, password: senha}).subscribe({
        next: (result: any) => {
          console.log("🚀 ~ file: change-password.component.ts:58 ~ ChangePasswordComponent ~ this.authService.changePassword ~ result:", result)
          this.loading.hide();
          if(result.success === true){
            this.loading.notify('Sucesso', 'Senha alterada com sucesso!', '/login');
          }else{
            if(result.code === 'auth/invalid-password'){
              this.loading.notify('Erro', 'Senha inválida!');
            }
            if(result.code === 'auth/expired-action-code'){
              this.loading.notify('Erro', 'O link de alteração de senha expirou!', '/login');
            }
            if(result.code === 'auth/user-disabled'){
              this.loading.notify('Erro', 'Usuário desabilitado!');
            }
            if(result.code === 'auth/invalid-action-code'){
              this.loading.notify('Erro', 'Link de alteração de senha inválido, ou expirado!', '/login');
            }
          }
          this.displayModal = true;
        },
        error: (error: any) => {
          console.log("🚀 ~ file: change-password.component.ts:61 ~ ChangePasswordComponent ~ this.authService.changePassword ~ error", error)
          this.loading.hide();
          this.loading.notify('Erro', 'Erro ao alterar senha!', '/login');
        }
      });
    }
  }
}
