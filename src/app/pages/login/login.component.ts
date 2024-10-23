import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/service/auth.service';
import { LoadingService } from 'src/app/service/loading.service';
// import { MessageService } from 'src/app/service/message.service';
// import { SessionService } from 'src/app/service/session.service';
// import { LoadingService } from 'src/app/shared/loading/loading.service.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  showpassword: boolean = false;
  display: boolean = false;
  emailRec: string = '';
  modal: boolean = false;
  ModalPrimeiroAcesso: boolean = false;

  constructor(
    private _fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
    private loading: LoadingService,
    // private readonly sessionService: SessionService
  ) { }

  public loginForm: FormGroup = this._fb.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  public emailRecForm: FormGroup = this._fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  public NewUserEmailForm: FormGroup = this._fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  closeModal() {
    this.emailRecForm.reset();
    this.NewUserEmailForm.reset();
  }

  login() {
    this.loading.show();
    const emailControl = this.loginForm.get('email');
    const email = emailControl!.value;
    const passwordControl = this.loginForm.get('password');
    const password = passwordControl!.value;
    if (this.loginForm.valid) {
      this.authService.login(email, password).subscribe({
        next: (result: any) => {
          console.log("🚀 ~ file: login.component.ts:58 ~ LoginComponent ~ this.authService.login ~ result:", result)
          if (result.user) {
            this.loading.hide();
            sessionStorage.setItem('user', JSON.stringify(result.user));
            if (localStorage.getItem('procedimento') == null) {
              this.router.navigate(['/meus-agendamentos']);
            }
            else {
              this.router.navigate(['/pre-agendamento']);
            }
          }
        },
        error: (error: any) => {
          this.loading.hide();
          this.notify2('Aviso!', 'Usuário ou senha incorretos.');
        }
      });
    }
    else {
      this.loading.hide();
      console.log("🚀 ~ file: login.component.ts:75 ~ LoginComponent ~ login ~ this.loginForm:", this.loginForm)
      this.notify2('Aviso!', 'Usuário ou senha incorretos.');
    }
  }

  notify2(titulo: string = "Aviso!", mensagem: string = "Código enviado para o e-mail cadastrado.", redirect: string = '/login') {
    this.messageService.clear();
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

  showHidePassword(): void {
    const x: any = document.getElementById('inputPassword');
    if (x.type === 'password') {
      this.showpassword = true;
      x.type = 'text';
    } else {
      this.showpassword = false;
      x.type = 'password';
    }
  }

  showDialog() {
    this.display = true;
  }
  showDialogEmail() {
    this.modal = true;
  }

  ngOnInit(): void {
  }

  showInfo() {
    // this.messageService.add({severity:'info', summary: 'Obrigado!', detail: 'E-mail enviado com sucesso.'}),
    this.display = false;
    this.emailRecForm.reset();
  }

  async recuperasenha(): Promise<any> {
    if (this.emailRecForm.valid) {
      const useremail = this.emailRecForm.get('email')?.value;
      const emailuser = { email: useremail };
      const email = JSON.stringify(emailuser);
      // validate email format
      const emailRegex = new RegExp('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$');
      if (!emailRegex.test(useremail)) {
        this.notify2('Aviso!', 'E-mail inválido.');
        return;
      }
      this.sendResetPassword();
    }
    else {
      this.notify2('Aviso!', 'E-mail inválido.');
    }
    this.display = false;
  }

  sendResetPassword() {
    this.loading.show();
    this.authService.sendResetPassword(this.emailRecForm.get('email')?.value).subscribe({
      next: (result: any) => {
        this.loading.hide();
        this.notify2('Aviso!', 'Se o e-mail informado estiver cadastrado, você receberá um link para redefinir sua senha.');
        this.closeModal();
      },
      error: (error: any) => {
        this.loading.hide();
        this.notify2('Aviso!', 'E-mail não encontrado.');
      }
    });
  }

}

